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

  async start(userId: string, params: { examTypeId: string; blueprintId?: string; totalQuestions?: number }) {
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

    // Return session + the picked questions with full detail
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

    return { session, blueprint, questions };
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
        questions: { include: { question: { include: { options: true } } } },
      },
    });
    if (!session || session.userId !== userId) throw new NotFoundException('Mock exam not found');
    if (session.type !== 'MOCK_EXAM') throw new BadRequestException('Not a mock-exam session');
    return session;
  }
}
