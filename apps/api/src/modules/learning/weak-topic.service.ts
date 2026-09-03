import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

/** Deliberately small, explainable rule for review recommendations. */
export const WEAK_TOPIC_CONFIG = {
  minimumAttempts: 2,
  maximumAccuracy: 0.7,
  defaultPracticeQuestions: 10,
} as const;

@Injectable()
export class WeakTopicService {
  constructor(private readonly prisma: PrismaService) {}

  list(userId: string, take = 10) {
    return this.prisma.userTopicStat.findMany({
      where: {
        userId,
        attemptCount: { gte: WEAK_TOPIC_CONFIG.minimumAttempts },
        accuracy: { lt: WEAK_TOPIC_CONFIG.maximumAccuracy },
      },
      include: { topic: true },
      orderBy: [{ accuracy: 'asc' }, { attemptCount: 'desc' }, { topicId: 'asc' }],
      take,
    });
  }

  async choose(userId: string, topicId?: string) {
    if (topicId) {
      const stat = await this.prisma.userTopicStat.findFirst({
        where: { userId, topicId, attemptCount: { gte: WEAK_TOPIC_CONFIG.minimumAttempts }, accuracy: { lt: WEAK_TOPIC_CONFIG.maximumAccuracy } },
        include: { topic: true },
      });
      return stat;
    }
    const [stat] = await this.list(userId, 1);
    return stat;
  }
}
