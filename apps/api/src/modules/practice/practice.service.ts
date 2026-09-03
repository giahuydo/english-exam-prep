import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import type { StartSessionDto, SubmitAnswerDto } from '@app/shared';
import { QuestionSelectorService } from '../learning/question-selector.service';
import { MasteryService } from '../learning/mastery.service';
import { MistakeReviewService } from '../learning/mistake-review.service';

export interface AnswerResponse {
  attemptId: string;
  isCorrect: boolean | null;
  selectedOptionId?: string | null;
  correctOptionId?: string | null;
  correctOptionKey?: string | null;
  explanation: string | null;
  wrongOptionExplanations: Array<{
    optionId: string;
    optionKey: string;
    explanation: string | null;
  }>;
  hintLevelUsed: number;
}

@Injectable()
export class PracticeService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly selector: QuestionSelectorService,
    private readonly mastery: MasteryService,
    private readonly mistakes: MistakeReviewService,
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

    let questions: Awaited<ReturnType<QuestionSelectorService['select']>> = [];

    if (dto.type === 'MISTAKE_REVIEW') {
      const mistakes = await this.mistakes.list(userId, dto.totalQuestions);
      const seen = new Set<string>();
      questions = mistakes
        .map((m) => m.question)
        .filter((q) => {
          if (seen.has(q.id)) return false;
          seen.add(q.id);
          return true;
        }) as unknown as typeof questions;
    } else {
      const topicIds = dto.topicIds.length || dto.topicId
        ? [...dto.topicIds, ...(dto.topicId ? [dto.topicId] : [])]
        : undefined;
      questions = await this.selector.select({
        topicIds,
        level: dto.level,
        difficulty: dto.difficulty,
        take: dto.totalQuestions,
      });
    }

    if (questions.length > 0) {
      await this.prisma.quizSessionQuestion.createMany({
        data: questions.map((q, position) => ({
          quizSessionId: session.id,
          questionId: q.id,
          position,
        })),
      });
    }

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

  async submitAnswer(
    userId: string,
    sessionId: string,
    dto: SubmitAnswerDto,
  ): Promise<AnswerResponse> {
    const session = await this.prisma.quizSession.findUnique({ where: { id: sessionId } });
    if (!session || session.userId !== userId) throw new NotFoundException('Session not found');
    if (session.status !== 'IN_PROGRESS') throw new BadRequestException('Session not active');

    // Load question + all options so we can build the deterministic explanation
    // response without another round-trip.
    const question = await this.prisma.question.findUnique({
      where: { id: dto.questionId },
      include: { options: { orderBy: { position: 'asc' } } },
    });
    if (!question) throw new NotFoundException('Question not found');

    let isCorrect: boolean | null = null;
    if (dto.selectedOptionId) {
      const opt = question.options.find((o) => o.id === dto.selectedOptionId);
      isCorrect = !!opt && opt.isCorrect;
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

    if (isCorrect !== null) {
      await this.mastery.recordAttempt(
        userId,
        dto.questionId,
        isCorrect,
        dto.hintLevelUsed,
        dto.timeSpentSeconds,
      );
    }

    const correctOption = question.options.find((o) => o.isCorrect);
    // Only surface explanations for INCORRECT options (i.e. the "why" for
    // wrong choices). Callers filter further by whether the user picked one.
    const wrongOptionExplanations = question.options
      .filter((o) => !o.isCorrect)
      .map((o) => ({
        optionId: o.id,
        optionKey: o.optionKey,
        explanation: o.explanation ?? null,
      }));

    return {
      attemptId: attempt.id,
      isCorrect,
      selectedOptionId: dto.selectedOptionId ?? null,
      correctOptionId: correctOption?.id ?? null,
      correctOptionKey: correctOption?.optionKey ?? null,
      explanation: question.explanation ?? null,
      wrongOptionExplanations,
      hintLevelUsed: dto.hintLevelUsed,
    };
  }

  async revealHint(
    userId: string,
    sessionId: string,
    questionId: string,
    hintLevel: 1 | 2 | 3,
  ): Promise<{ hintLevel: number; hint: string | null }> {
    const session = await this.prisma.quizSession.findUnique({ where: { id: sessionId } });
    if (!session || session.userId !== userId) throw new NotFoundException('Session not found');
    if (session.status !== 'IN_PROGRESS') throw new BadRequestException('Session not active');

    const question = await this.prisma.question.findUnique({ where: { id: questionId } });
    if (!question) throw new NotFoundException('Question not found');

    const hint = hintLevel === 1 ? question.hint1 : hintLevel === 2 ? question.hint2 : question.hint3;
    // Hints are read-only reveals. The `hint_level_used` on QuestionAttempt is
    // set when the user actually submits — this endpoint intentionally does
    // NOT mutate any prior attempt (attempts are created ONLY on submit).
    return { hintLevel, hint: hint ?? null };
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
