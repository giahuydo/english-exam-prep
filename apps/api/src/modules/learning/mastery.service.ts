import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class MasteryService {
  constructor(private readonly prisma: PrismaService) {}

  async recordAttempt(userId: string, questionId: string, correct: boolean, hintLevel: number, time?: number) {
    const topics = await this.prisma.questionTopic.findMany({ where: { questionId }, select: { topicId: true } });
    for (const { topicId } of topics) {
      const old = await this.prisma.userTopicStat.findUnique({ where: { userId_topicId: { userId, topicId } } });
      const attempts = (old?.attemptCount ?? 0) + 1;
      const correctCount = (old?.correctCount ?? 0) + (correct ? 1 : 0);
      const avgTime = (((old?.avgTimeSeconds ?? 0) * (attempts - 1)) + (time ?? 0)) / attempts;
      const accuracy = correctCount / attempts;
      await this.prisma.userTopicStat.upsert({
        where: { userId_topicId: { userId, topicId } },
        update: { attemptCount: attempts, correctCount, accuracy, hintCount: (old?.hintCount ?? 0) + (hintLevel > 0 ? 1 : 0), avgTimeSeconds: avgTime, masteryScore: Math.max(0, Math.min(1, accuracy - (old?.hintCount ?? 0) / attempts * 0.05)), lastAttemptAt: new Date() },
        create: { userId, topicId, attemptCount: 1, correctCount: correct ? 1 : 0, accuracy, hintCount: hintLevel > 0 ? 1 : 0, avgTimeSeconds: time ?? 0, masteryScore: correct ? 1 : 0, lastAttemptAt: new Date() },
      });
    }
  }
}
