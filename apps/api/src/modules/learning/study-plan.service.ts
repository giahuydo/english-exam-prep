import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class LearningStudyPlanService {
  constructor(private readonly prisma: PrismaService) {}

  async generateFromWeakTopics(userId: string) {
    const stats = await this.prisma.userTopicStat.findMany({ where: { userId }, orderBy: { masteryScore: 'asc' }, take: 5 });
    return this.prisma.studyPlan.create({ data: { userId, title: 'Targeted weak-area plan', generatedBy: 'SYSTEM', topics: { create: stats.map((s, i) => ({ topicId: s.topicId, priority: i + 1, targetQuestionCount: 10, reason: `Current mastery: ${Math.round(s.masteryScore * 100)}%` })) } }, include: { topics: { include: { topic: true } } } });
  }
}
