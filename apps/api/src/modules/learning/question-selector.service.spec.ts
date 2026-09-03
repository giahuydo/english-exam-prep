import { QuestionSelectorService } from './question-selector.service';

describe('QuestionSelectorService.selectForUser', () => {
  it('reads weak topics and mistakes for the requesting user only', async () => {
    const select = jest.fn(async ({ take }: { take: number }) =>
      Array.from({ length: take }, (_, i) => ({ id: `q${i}`, options: [], topics: [], questionType: {} })),
    );
    const prisma = {
      userTopicStat: { findMany: jest.fn().mockResolvedValue([{ topicId: 'topic-a' }]) },
      questionAttempt: { findMany: jest.fn().mockResolvedValue([{ questionId: 'q-mistake' }]) },
      question: { findMany: jest.fn().mockResolvedValue([]) },
    };
    const svc = new QuestionSelectorService(prisma as never);
    await svc.selectForUser('user-a', { take: 10 });
    expect(prisma.userTopicStat.findMany).toHaveBeenCalledWith(expect.objectContaining({ where: { userId: 'user-a', attemptCount: { gt: 0 } } }));
    expect(prisma.questionAttempt.findMany).toHaveBeenCalledWith(expect.objectContaining({ where: { userId: 'user-a', isCorrect: false } }));
    expect(select).not.toHaveBeenCalled();
  });
});
