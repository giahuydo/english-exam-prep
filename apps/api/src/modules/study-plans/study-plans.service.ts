import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

interface StudyPlanInput {
  title: string;
  summary?: string;
  generatedBy?: 'AI' | 'SYSTEM' | 'ADMIN';
  topics?: Array<{ topicId: string; priority?: number; targetQuestionCount?: number; reason?: string }>;
}

@Injectable()
export class StudyPlansService {
  constructor(private readonly prisma: PrismaService) {}

  list(userId: string) {
    return this.prisma.studyPlan.findMany({
      where: { userId },
      include: { topics: { include: { topic: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(userId: string, id: string) {
    const plan = await this.prisma.studyPlan.findUnique({
      where: { id },
      include: { topics: { include: { topic: true } } },
    });
    if (!plan || plan.userId !== userId) throw new NotFoundException('Study plan not found');
    return plan;
  }

  create(userId: string, dto: StudyPlanInput) {
    return this.prisma.studyPlan.create({
      data: {
        userId,
        title: dto.title,
        summary: dto.summary,
        generatedBy: (dto.generatedBy ?? 'SYSTEM') as never,
        topics: dto.topics
          ? {
              create: dto.topics.map((t) => ({
                topicId: t.topicId,
                priority: t.priority ?? 0,
                targetQuestionCount: t.targetQuestionCount ?? 0,
                reason: t.reason,
              })),
            }
          : undefined,
      },
    });
  }

  remove(userId: string, id: string) {
    return this.prisma.studyPlan.deleteMany({ where: { id, userId } });
  }
}
