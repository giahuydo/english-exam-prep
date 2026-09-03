import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class QuestionSelectorService {
  constructor(private readonly prisma: PrismaService) {}

  // Deterministic mixed review: 40% weak-topic, 25% recent mistakes,
  // 20% requested/current topic, and 15% general mixed review.
  async selectForUser(userId: string, filters: { topicIds?: string[]; level?: string; difficulty?: string; take: number }) {
    const take = filters.take;
    const weakTake = Math.ceil(take * 0.4);
    const mistakeTake = Math.floor(take * 0.25);
    const topicTake = Math.floor(take * 0.2);
    const mixedTake = Math.max(0, take - weakTake - mistakeTake - topicTake);
    const weak = await this.prisma.userTopicStat.findMany({ where: { userId, attemptCount: { gt: 0 } }, orderBy: [{ masteryScore: 'asc' }, { lastAttemptAt: 'asc' }], take: 10, select: { topicId: true } });
    const mistakes = await this.prisma.questionAttempt.findMany({ where: { userId, isCorrect: false }, orderBy: { createdAt: 'desc' }, distinct: ['questionId'], take: mistakeTake, select: { questionId: true } });
    const common = { level: filters.level as never, difficulty: filters.difficulty as never };
    const buckets = await Promise.all([
      this.select({ ...common, topicIds: weak.map((s) => s.topicId), take: weakTake }),
      this.prisma.question.findMany({ where: { id: { in: mistakes.map((m) => m.questionId) }, status: 'PUBLISHED' }, include: { options: { orderBy: { position: 'asc' } }, topics: { include: { topic: true } }, questionType: true }, orderBy: { createdAt: 'asc' }, take: mistakeTake }),
      this.select({ ...common, topicIds: filters.topicIds, take: topicTake }),
      this.select({ ...common, take: mixedTake }),
    ]);
    const seen = new Set<string>();
    return buckets.flat().filter((q) => !seen.has(q.id) && seen.add(q.id)).slice(0, take);
  }

  select(filters: { topicIds?: string[]; level?: string; difficulty?: string; take: number }) {
    return this.prisma.question.findMany({
      where: {
        status: 'PUBLISHED',
        ...(filters.level ? { level: filters.level as never } : {}),
        ...(filters.difficulty ? { difficulty: filters.difficulty as never } : {}),
        ...(filters.topicIds?.length ? { topics: { some: { topicId: { in: filters.topicIds } } } } : {}),
      },
      include: { options: { orderBy: { position: 'asc' } }, topics: { include: { topic: true } }, questionType: true },
      orderBy: [{ difficulty: 'asc' }, { createdAt: 'asc' }],
      take: filters.take,
    });
  }
}
