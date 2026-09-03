import { BadRequestException } from '@nestjs/common';
import { PracticeService } from './practice.service';

describe('PracticeService learning flow', () => {
  const question = {
    id: 'q1', content: 'Choose the correct answer', instruction: null, context: null,
    level: 'B1', difficulty: 'MEDIUM', hint1: 'Look for the time signal.',
    hint2: 'Use the past simple for a finished action.', hint3: 'Eliminate options with the wrong tense.',
    explanation: 'The time signal describes a finished action.', ruleStructure: 'subject + past simple',
    commonMistake: 'Choosing the present perfect with a finished-time expression.', example: 'She visited Hue last year.',
    questionType: { code: 'MCQ', name: 'Multiple choice' }, topics: [],
    options: [
      { id: 'o1', optionKey: 'A', content: 'visited', isCorrect: true, explanation: null, position: 0 },
      { id: 'o2', optionKey: 'B', content: 'has visited', isCorrect: false, explanation: 'The time is finished.', position: 1 },
    ],
  };

  function createService() {
    const prisma = {
      quizSession: { findUnique: jest.fn() },
      quizSessionQuestion: { findUnique: jest.fn() },
      question: { findUnique: jest.fn() },
      questionAttempt: { findFirst: jest.fn(), create: jest.fn() },
      hintReveal: { findUnique: jest.fn(), upsert: jest.fn() },
    };
    const mastery = { recordAttempt: jest.fn() };
    const selector = { select: jest.fn() };
    const mistakes = { list: jest.fn() };
    return { service: new PracticeService(prisma as never, selector as never, mastery as never, mistakes as never), prisma, mastery };
  }

  it('returns sanitized questions without answer or explanation fields', async () => {
    const { service, prisma } = createService();
    prisma.quizSession.findUnique.mockResolvedValue({ id: 's1', userId: 'u1', attempts: [], questions: [{ position: 0, question }] });
    const result = await service.getById('u1', 's1');
    const returned = result.questions[0].question as Record<string, unknown>;
    expect(returned.options).toEqual([{ id: 'o1', optionKey: 'A', content: 'visited' }, { id: 'o2', optionKey: 'B', content: 'has visited' }]);
    expect(returned).not.toHaveProperty('isCorrect');
    expect(returned).not.toHaveProperty('explanation');
  });

  it('requires progressive hint order and stores the highest revealed level', async () => {
    const { service, prisma } = createService();
    prisma.quizSession.findUnique.mockResolvedValue({ id: 's1', userId: 'u1', status: 'IN_PROGRESS' });
    prisma.quizSessionQuestion.findUnique.mockResolvedValue({ question });
    prisma.hintReveal.findUnique.mockResolvedValue({ maxLevel: 0 });
    await expect(service.revealHint('u1', 's1', 'q1', 2)).rejects.toBeInstanceOf(BadRequestException);
    prisma.hintReveal.findUnique.mockResolvedValue({ maxLevel: 1 });
    prisma.hintReveal.upsert.mockResolvedValue({ maxLevel: 2 });
    await expect(service.revealHint('u1', 's1', 'q1', 2)).resolves.toEqual({ hintLevel: 2, hint: question.hint2 });
  });

  it('does not create a second attempt when the same question is submitted twice', async () => {
    const { service, prisma } = createService();
    prisma.quizSession.findUnique.mockResolvedValue({ id: 's1', userId: 'u1', status: 'IN_PROGRESS' });
    prisma.quizSessionQuestion.findUnique.mockResolvedValue({ id: 'sq1' });
    prisma.questionAttempt.findFirst.mockResolvedValue({ id: 'a1', isCorrect: true, selectedOptionId: 'o1', hintLevelUsed: 1 });
    prisma.question.findUnique.mockResolvedValue(question);
    const result = await service.submitAnswer('u1', 's1', { questionId: 'q1', selectedOptionId: 'o2', hintLevelUsed: 3 });
    expect(result.attemptId).toBe('a1');
    expect(prisma.questionAttempt.create).not.toHaveBeenCalled();
  });

  it('returns teaching explanation only after submission', async () => {
    const { service, prisma, mastery } = createService();
    prisma.quizSession.findUnique.mockResolvedValue({ id: 's1', userId: 'u1', status: 'IN_PROGRESS' });
    prisma.quizSessionQuestion.findUnique.mockResolvedValue({ id: 'sq1' });
    prisma.questionAttempt.findFirst.mockResolvedValue(null);
    prisma.question.findUnique.mockResolvedValue(question);
    prisma.questionAttempt.create.mockResolvedValue({ id: 'a1' });
    const result = await service.submitAnswer('u1', 's1', { questionId: 'q1', selectedOptionId: 'o1', hintLevelUsed: 0 });
    expect(result).toMatchObject({ isCorrect: true, explanation: question.explanation, ruleStructure: question.ruleStructure, example: question.example });
    expect(result.wrongOptionExplanations).toEqual([{ optionId: 'o2', optionKey: 'B', explanation: 'The time is finished.' }]);
    expect(mastery.recordAttempt).toHaveBeenCalled();
  });
});
