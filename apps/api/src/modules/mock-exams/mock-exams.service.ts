import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { QuestionSelectorService } from '../learning/question-selector.service';

/**
 * Mock exam = a QuizSession of type=MOCK_EXAM whose questions are sampled
 * from the exam type's active/draft blueprint. Kept out of PracticeService
 * so the composition rule (blueprint items -> question buckets) has its own
 * home.
 */
@Injectable()
export class MockExamsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly selector: QuestionSelectorService,
  ) {}

  listBlueprints(examTypeId?: string) {
    return this.prisma.examBlueprint.findMany({
      where: examTypeId ? { examTypeId } : undefined,
      include: {
        examType: { select: { id: true, code: true, name: true } },
        items: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  private assertOwner(session: { userId: string; type: string }, userId: string) {
    if (session.userId !== userId) throw new NotFoundException('Mock exam not found');
    if (session.type !== 'MOCK_EXAM') throw new BadRequestException('Not a mock-exam session');
  }

  private sanitizeQuestion(question: {
    id: string; content: string; instruction: string | null; context: string | null;
    level: string; difficulty: string; questionType: unknown; topics: unknown;
    options: Array<{ id: string; optionKey: string; content: string }>;
  }) {
    return {
      id: question.id,
      content: question.content,
      instruction: question.instruction,
      context: question.context,
      level: question.level,
      difficulty: question.difficulty,
      questionType: question.questionType,
      topics: question.topics,
      options: question.options.map((option) => ({ id: option.id, optionKey: option.optionKey, content: option.content })),
    };
  }

  private remainingSeconds(session: { mockStatus: string | null; startedAt: Date; durationSeconds: number | null; pausedAt: Date | null; totalPausedSeconds: number }) {
    if (!session.durationSeconds) return null;
    const now = session.mockStatus === 'PAUSED' && session.pausedAt ? session.pausedAt : new Date();
    const elapsed = Math.floor((now.getTime() - session.startedAt.getTime()) / 1000) - session.totalPausedSeconds;
    return Math.max(0, session.durationSeconds - elapsed);
  }

  async start(userId: string, params: { examTypeId: string; blueprintId?: string; totalQuestions?: number; durationSeconds?: number }) {
    const blueprint = params.blueprintId
      ? await this.prisma.examBlueprint.findUnique({
          where: { id: params.blueprintId },
          include: { items: true },
        })
      : await this.prisma.examBlueprint.findFirst({
          where: { examTypeId: params.examTypeId },
          orderBy: [{ status: 'asc' }, { createdAt: 'desc' }],
          include: { items: true },
        });
    if (!blueprint) throw new NotFoundException('No blueprint for this exam type');
    if (blueprint.examTypeId !== params.examTypeId) {
      throw new BadRequestException('Blueprint does not belong to the requested exam type');
    }

    const total = params.totalQuestions ?? 40;
    // Distribute total questions across items by weight (fallback = uniform).
    const weightSum = blueprint.items.reduce((acc, it) => acc + (it.weight ?? 0), 0) || 1;
    const perItem = blueprint.items.map((it) => {
      const w = it.weight ?? 1 / blueprint.items.length;
      return { item: it, take: Math.max(1, Math.round((w / weightSum) * total)) };
    });

    const picked: Array<{ id: string }> = [];
    const seen = new Set<string>();
    for (const { item, take } of perItem) {
      const q = await this.selector.selectForUser(userId, {
        topicIds: item.topicId ? [item.topicId] : undefined,
        level: item.level ?? undefined,
        difficulty: item.difficulty ?? undefined,
        take,
      });
      for (const row of q) {
        if (seen.has(row.id)) continue;
        seen.add(row.id);
        picked.push({ id: row.id });
        if (total !== undefined && picked.length >= total) break;
      }
      if (total !== undefined && picked.length >= total) break;
    }

    const session = await this.prisma.quizSession.create({
      data: {
        userId,
        type: 'MOCK_EXAM',
        examTypeId: params.examTypeId,
        blueprintId: blueprint.id,
        totalQuestions: picked.length,
        mockStatus: 'RUNNING',
        durationSeconds: params.durationSeconds ?? 45 * 60,
        currentQuestionIndex: 0,
      },
    });

    if (picked.length > 0) {
      await this.prisma.quizSessionQuestion.createMany({
        data: picked.map((q, position) => ({
          quizSessionId: session.id,
          questionId: q.id,
          position,
        })),
      });
    }

    // Return only exam-safe content. Answers and teaching content are withheld until submission.
    const questions = picked.length
      ? await this.prisma.question.findMany({
          where: { id: { in: picked.map((p) => p.id) } },
          include: {
            options: { orderBy: { position: 'asc' } },
            topics: { include: { topic: true } },
            questionType: true,
          },
        })
      : [];

    return { session: { ...session, remainingSeconds: this.remainingSeconds(session) }, blueprint, questions: questions.map((q) => this.sanitizeQuestion(q)) };
  }

  async state(userId: string, id: string) {
    const session = await this.prisma.quizSession.findUnique({
      where: { id },
      include: {
        questions: {
          orderBy: { position: 'asc' },
          include: {
            question: {
              include: {
                options: { orderBy: { position: 'asc' } },
                topics: { include: { topic: true } },
                questionType: true,
              },
            },
          },
        },
        attempts: { select: { questionId: true, selectedOptionId: true, answerText: true } },
      },
    });
    if (!session) throw new NotFoundException('Mock exam not found');
    this.assertOwner(session, userId);
    let current = session;
    if (current.mockStatus === 'RUNNING' && this.remainingSeconds(current) === 0) {
      const expired = await this.prisma.quizSession.update({
        where: { id },
        data: { mockStatus: 'EXPIRED', status: 'EXPIRED', submittedAt: new Date(), completedAt: new Date() },
      });
      current = { ...current, ...expired };
    }
    return { ...current, remainingSeconds: this.remainingSeconds(current), questions: current.questions.map((row) => ({ ...row, question: this.sanitizeQuestion(row.question) })) };
  }

  private async transition(userId: string, id: string, action: 'pause' | 'resume') {
    const session = await this.prisma.quizSession.findUnique({ where: { id } });
    if (!session) throw new NotFoundException('Mock exam not found');
    this.assertOwner(session, userId);
    if (action === 'pause') {
      if (session.mockStatus !== 'RUNNING') throw new BadRequestException('Mock exam is not running');
      return this.prisma.quizSession.update({ where: { id }, data: { mockStatus: 'PAUSED', pausedAt: new Date() } });
    }
    if (session.mockStatus !== 'PAUSED') throw new BadRequestException('Mock exam is not paused');
    const pausedAt = session.pausedAt ?? new Date();
    const pauseSeconds = Math.max(0, Math.floor((Date.now() - pausedAt.getTime()) / 1000));
    return this.prisma.quizSession.update({ where: { id }, data: { mockStatus: 'RUNNING', pausedAt: null, totalPausedSeconds: { increment: pauseSeconds } } });
  }

  pause(userId: string, id: string) { return this.transition(userId, id, 'pause'); }
  resume(userId: string, id: string) { return this.transition(userId, id, 'resume'); }

  async saveAnswer(userId: string, id: string, dto: { questionId: string; selectedOptionId?: string; answerText?: string; currentQuestionIndex?: number }) {
    const session = await this.prisma.quizSession.findUnique({ where: { id } });
    if (!session) throw new NotFoundException('Mock exam not found');
    this.assertOwner(session, userId);
    if (session.mockStatus !== 'RUNNING' && session.mockStatus !== 'PAUSED') throw new BadRequestException('Mock exam is closed');
    if (this.remainingSeconds(session) === 0 && session.mockStatus === 'RUNNING') throw new BadRequestException('Mock exam expired');
    const inSession = await this.prisma.quizSessionQuestion.findUnique({ where: { quizSessionId_questionId: { quizSessionId: id, questionId: dto.questionId } } });
    if (!inSession) throw new BadRequestException('Question is not in this mock exam');
    const attempt = await this.prisma.questionAttempt.upsert({ where: { quizSessionId_questionId: { quizSessionId: id, questionId: dto.questionId } }, create: { quizSessionId: id, userId, questionId: dto.questionId, selectedOptionId: dto.selectedOptionId, answerText: dto.answerText }, update: { selectedOptionId: dto.selectedOptionId, answerText: dto.answerText } });
    const updated = dto.currentQuestionIndex === undefined ? session : await this.prisma.quizSession.update({ where: { id }, data: { currentQuestionIndex: dto.currentQuestionIndex } });
    return { questionId: dto.questionId, selectedOptionId: attempt.selectedOptionId, answerText: attempt.answerText, currentQuestionIndex: updated.currentQuestionIndex };
  }

  async submit(userId: string, id: string) {
    const session = await this.prisma.quizSession.findUnique({ where: { id }, include: { attempts: { include: { selectedOption: true } } } });
    if (!session) throw new NotFoundException('Mock exam not found');
    this.assertOwner(session, userId);
    if (session.mockStatus !== 'RUNNING' && session.mockStatus !== 'PAUSED') throw new BadRequestException('Mock exam already submitted');
    const expired = session.mockStatus === 'RUNNING' && this.remainingSeconds(session) === 0;
    const correctCount = session.attempts.filter((a) => a.selectedOption?.isCorrect).length;
    const updated = await this.prisma.quizSession.update({ where: { id }, data: { mockStatus: expired ? 'EXPIRED' : 'SUBMITTED', status: expired ? 'EXPIRED' : 'COMPLETED', submittedAt: new Date(), completedAt: new Date(), correctCount, score: session.totalQuestions ? correctCount / session.totalQuestions : 0 } });
    return { session: updated, correctCount, score: updated.score };
  }

  listForUser(userId: string) {
    return this.prisma.quizSession.findMany({
      where: { userId, type: 'MOCK_EXAM' },
      include: {
        blueprint: { select: { id: true, name: true, version: true, provenance: true, source: true } },
        examType: { select: { id: true, code: true, name: true } },
      },
      orderBy: { startedAt: 'desc' },
    });
  }

  async findById(userId: string, id: string) {
    const session = await this.prisma.quizSession.findUnique({
      where: { id },
      include: {
        blueprint: true,
        attempts: true,
        questions: { include: { question: { include: { options: { orderBy: { position: 'asc' } }, topics: { include: { topic: true } }, questionType: true } } } },
      },
    });
    if (!session || session.userId !== userId) throw new NotFoundException('Mock exam not found');
    if (session.type !== 'MOCK_EXAM') throw new BadRequestException('Not a mock-exam session');
    return { ...session, remainingSeconds: this.remainingSeconds(session), questions: session.questions.map((row) => ({ ...row, question: this.sanitizeQuestion(row.question) })) };
  }
}
