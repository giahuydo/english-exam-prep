import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import type { StartSessionDto, SubmitAnswerDto } from '@app/shared';
import { QuestionSelectorService } from '../learning/question-selector.service';
import { MasteryService } from '../learning/mastery.service';

@Injectable()
export class PracticeService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly selector: QuestionSelectorService,
    private readonly mastery: MasteryService,
  ) {}

  async start(userId: string, dto: StartSessionDto) {
    const session = await this.prisma.quizSession.create({
      data: {
        userId,
        type: dto.type as never,
        examTypeId: dto.examTypeId,
        blueprintId: dto.blueprintId,
        totalQuestions: dto.totalQuestions,
      },
    });

    const topicIds = dto.topicIds.length || dto.topicId
      ? [...dto.topicIds, ...(dto.topicId ? [dto.topicId] : [])]
      : undefined;
    const questions = await this.selector.select({
      topicIds,
      level: dto.level,
      difficulty: dto.difficulty,
      take: dto.totalQuestions,
    });
    await this.prisma.quizSessionQuestion.createMany({
      data: questions.map((q, position) => ({ quizSessionId: session.id, questionId: q.id, position })),
    });

    return { session, questions };
  }

  async getById(userId: string, sessionId: string) {
    const s = await this.prisma.quizSession.findUnique({
      where: { id: sessionId },
      include: { attempts: true },
    });
    if (!s || s.userId !== userId) throw new NotFoundException('Session not found');
    return s;
  }

  async submitAnswer(userId: string, sessionId: string, dto: SubmitAnswerDto) {
    const session = await this.prisma.quizSession.findUnique({ where: { id: sessionId } });
    if (!session || session.userId !== userId) throw new NotFoundException('Session not found');
    if (session.status !== 'IN_PROGRESS') throw new BadRequestException('Session not active');

    let isCorrect: boolean | null = null;
    if (dto.selectedOptionId) {
      const opt = await this.prisma.questionOption.findUnique({
        where: { id: dto.selectedOptionId },
      });
      if (opt && opt.questionId === dto.questionId) {
        isCorrect = opt.isCorrect;
      } else {
        isCorrect = false;
      }
    }

    const attempt = await this.prisma.questionAttempt.create({
      data: {
        quizSessionId: sessionId,
        userId,
        questionId: dto.questionId,
        selectedOptionId: dto.selectedOptionId,
        answerText: dto.answerText,
        isCorrect,
        score: isCorrect ? 1 : 0,
        hintLevelUsed: dto.hintLevelUsed,
        timeSpentSeconds: dto.timeSpentSeconds,
      },
    });
    if (isCorrect !== null) await this.mastery.recordAttempt(userId, dto.questionId, isCorrect, dto.hintLevelUsed, dto.timeSpentSeconds);
    return attempt;
  }

  async complete(userId: string, sessionId: string) {
    const session = await this.prisma.quizSession.findUnique({
      where: { id: sessionId },
      include: { attempts: true },
    });
    if (!session || session.userId !== userId) throw new NotFoundException('Session not found');
    const correctCount = session.attempts.filter((a) => a.isCorrect === true).length;
    const total = session.totalQuestions || session.attempts.length || 1;
    const score = correctCount / total;
    return this.prisma.quizSession.update({
      where: { id: sessionId },
      data: {
        status: 'COMPLETED',
        completedAt: new Date(),
        correctCount,
        score,
      },
    });
  }
}
