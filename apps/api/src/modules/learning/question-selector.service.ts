import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class QuestionSelectorService {
  constructor(private readonly prisma: PrismaService) {}

  select(filters: { topicIds?: string[]; questionTypeId?: string; level?: string; difficulty?: string; take: number }) {
    return this.prisma.question.findMany({
      where: {
        status: 'PUBLISHED',
        ...(filters.level ? { level: filters.level as never } : {}),
        ...(filters.difficulty ? { difficulty: filters.difficulty as never } : {}),
        ...(filters.topicIds?.length ? { topics: { some: { topicId: { in: filters.topicIds } } } } : {}),
        ...(filters.questionTypeId ? { questionTypeId: filters.questionTypeId } : {}),
      },
      include: { options: { orderBy: { position: 'asc' } }, topics: { include: { topic: true } }, questionType: true },
      orderBy: [{ difficulty: 'asc' }, { createdAt: 'asc' }],
      take: filters.take,
    });
  }
}
