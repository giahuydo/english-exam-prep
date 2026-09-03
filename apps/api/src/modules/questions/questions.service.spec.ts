import { QuestionsService } from './questions.service';
import {
  ContentRole,
  ExamLevel,
  QuestionDifficulty,
  QuestionOrigin,
  QuestionStatus,
  QuestionTopicSource,
} from '@app/shared';

describe('QuestionsService.create', () => {
  const buildPrismaMock = () => {
    const create = jest.fn().mockImplementation(({ data }: { data: Record<string, unknown> }) =>
      Promise.resolve({ id: 'q1', ...data, options: [], topics: [] }),
    );
    return {
      question: { create },
      _create: create,
    };
  };

  it('forces status=DRAFT when origin=AI_GENERATED, even if caller passes PUBLISHED', async () => {
    const prisma = buildPrismaMock();
    // svc only needs .question.create; cast is intentional for the mock.
    const svc = new QuestionsService(prisma as never);

    await svc.create(
      {
        questionTypeId: '00000000-0000-0000-0000-0000000000aa',
        origin: QuestionOrigin.AI_GENERATED,
        contentRole: ContentRole.AI_GENERATED,
        content: 'Fill the blank: I ___ to school every day.',
        level: ExamLevel.B1,
        difficulty: QuestionDifficulty.MEDIUM,
        status: QuestionStatus.PUBLISHED, // caller tries to publish directly
        secondaryTopicIds: [],
        topicSource: QuestionTopicSource.AI,
        options: [],
      },
      'user-1',
    );

    const arg = prisma._create.mock.calls[0][0] as { data: { status: string; origin: string } };
    expect(arg.data.origin).toBe(QuestionOrigin.AI_GENERATED);
    expect(arg.data.status).toBe(QuestionStatus.DRAFT);
  });

  it('respects caller-provided status for MANUAL/ORIGINAL', async () => {
    const prisma = buildPrismaMock();
    const svc = new QuestionsService(prisma as never);

    await svc.create({
      questionTypeId: '00000000-0000-0000-0000-0000000000aa',
      origin: QuestionOrigin.MANUAL,
      contentRole: ContentRole.PRACTICE,
      content: 'x',
      level: ExamLevel.B2,
      difficulty: QuestionDifficulty.MEDIUM,
      status: QuestionStatus.REVIEWED,
      secondaryTopicIds: [],
      topicSource: QuestionTopicSource.ADMIN,
      options: [],
    });

    const arg = prisma._create.mock.calls[0][0] as { data: { status: string } };
    expect(arg.data.status).toBe(QuestionStatus.REVIEWED);
  });
});
