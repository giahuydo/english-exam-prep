import { ResultsService } from './results.service';

describe('ResultsService', () => {
  it('cannot aggregate a session owned by another user', async () => {
    const findFirst = jest.fn().mockResolvedValue(null);
    const service = new ResultsService(
      { quizSession: { findFirst } } as never,
      {} as never,
      {} as never,
    );

    await expect(service.get('user-2', 'session-1')).rejects.toThrow('Session not found');
    expect(findFirst).toHaveBeenCalledWith(expect.objectContaining({ where: { id: 'session-1', userId: 'user-2' } }));
  });

  it('always returns the continue action in stable order', async () => {
    const findFirst = jest.fn().mockResolvedValue({
      id: 's1', userId: 'u1', type: 'TOPIC_PRACTICE', status: 'COMPLETED', totalQuestions: 1,
      attempts: [{ questionId: 'q1', isCorrect: true }],
      questions: [{ questionId: 'q1', question: { examSection: null, topics: [] } }],
    });
    const service = new ResultsService(
      { quizSession: { findFirst } } as never,
      { list: jest.fn().mockResolvedValue([]) } as never,
      { list: jest.fn().mockResolvedValue([]) } as never,
    );

    const result = await service.get('u1', 's1');
    expect(result.actions).toEqual(['CONTINUE_NEXT_SCOPE']);
  });
});
