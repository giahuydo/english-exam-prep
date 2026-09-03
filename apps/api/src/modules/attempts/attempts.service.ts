import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

/**
 * Read-only "attempts" queries decoupled from the practice engine.
 * PracticeService owns writes (submitAnswer); this service just surfaces
 * history + per-question detail for review UIs.
 */
@Injectable()
export class AttemptsService {
  constructor(private readonly prisma: PrismaService) {}

  listForSession(userId: string, sessionId: string) {
    return this.prisma.questionAttempt.findMany({
      where: { userId, quizSessionId: sessionId },
      include: {
        question: {
          include: {
            options: { orderBy: { position: 'asc' } },
            topics: { include: { topic: true } },
            questionType: true,
          },
        },
        selectedOption: true,
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  listRecentForUser(userId: string, take = 50) {
    return this.prisma.questionAttempt.findMany({
      where: { userId },
      include: {
        question: { select: { id: true, content: true, level: true, difficulty: true } },
        selectedOption: { select: { id: true, optionKey: true, content: true, isCorrect: true } },
      },
      orderBy: { createdAt: 'desc' },
      take,
    });
  }

  async findById(userId: string, id: string) {
    const attempt = await this.prisma.questionAttempt.findUnique({
      where: { id },
      include: {
        question: {
          include: {
            options: { orderBy: { position: 'asc' } },
            topics: { include: { topic: true } },
          },
        },
        selectedOption: true,
      },
    });
    if (!attempt || attempt.userId !== userId) throw new NotFoundException('Attempt not found');
    return attempt;
  }
}
