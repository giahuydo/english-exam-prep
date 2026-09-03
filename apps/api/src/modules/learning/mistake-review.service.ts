import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class MistakeReviewService {
  constructor(private readonly prisma: PrismaService) {}

  list(userId: string, take = 100) {
    return this.prisma.questionAttempt.findMany({
      where: { userId, isCorrect: false },
      distinct: ['questionId'],
      include: {
        question: {
          include: {
            options: { orderBy: { position: 'asc' } },
            topics: { include: { topic: true } },
            questionType: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take,
    });
  }
}
