import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class QuestionSelectorService {
  constructor(private readonly prisma: PrismaService) {}

  select(filters: { topicIds?: string[]; level?: string; difficulty?: string; take: number }) {
    return this.prisma.question.findMany({
      where: {
        status: 'PUBLISHED',
        level: filters.level as never,
        difficulty: filters.difficulty as never,
        ...(filters.topicIds?.length ? { topics: { some: { topicId: { in: filters.topicIds } } } } : {}),
      },
      include: { options: { orderBy: { position: 'asc' } }, topics: { include: { topic: true } }, questionType: true },
      orderBy: [{ difficulty: 'asc' }, { createdAt: 'asc' }],
      take: filters.take,
    });
  }
}
