import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import type { StartSessionDto, SubmitAnswerDto } from '@app/shared';
import { QuestionSelectorService } from '../learning/question-selector.service';
import { MasteryService } from '../learning/mastery.service';
import { MistakeReviewService } from '../learning/mistake-review.service';

interface PracticeQuestionOption {
  id: string;
  optionKey: string;
  content: string;
}

interface PracticeQuestionRecord {
  id: string;
  content: string;
  instruction: string | null;
  context: string | null;
  level: string;
  difficulty: string;
  questionType: unknown;
  topics: unknown;
  hint1: string | null;
  hint2: string | null;
  hint3: string | null;
  options: PracticeQuestionOption[];
}

export interface AnswerResponse {
  attemptId: string;
  isCorrect: boolean | null;
  selectedOptionId?: string | null;
  correctOptionId?: string | null;
  correctOptionKey?: string | null;
  explanation: string | null;
  ruleStructure: string | null;
  commonMistake: string | null;
  example: string | null;
  wrongOptionExplanations: Array<{
    optionId: string;
    optionKey: string;
    explanation: string | null;
  }>;
  hintLevelUsed: number;
}

interface TeachingContent {
  explanation: string | null;
  ruleStructure: string | null;
  commonMistake: string | null;
  example: string | null;
  wrongOptionExplanations: Array<{ optionId: string; optionKey: string; explanation: string | null }>;
}

@Injectable()
export class PracticeService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly selector: QuestionSelectorService,
    private readonly mastery: MasteryService,
    private readonly mistakes: MistakeReviewService,
  ) {}

  private toPracticeQuestion(question: PracticeQuestionRecord) {
    return {
      id: question.id,
      content: question.content,
      instruction: question.instruction,
      context: question.context,
      level: question.level,
      difficulty: question.difficulty,
      questionType: question.questionType,
      topics: question.topics,
      options: question.options.map((option) => ({        id: option.id,
        optionKey: option.optionKey,
        content: option.content,
      })),
      hint1: question.hint1,
      hint2: question.hint2,
      hint3: question.hint3,
    };
  }

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

    return { session, questions: questions.map((question) => this.toPracticeQuestion(question)) };
  }

  async getById(userId: string, sessionId: string) {
    const s = await this.prisma.quizSession.findUnique({
      where: { id: sessionId },
      include: {
        attempts: true,
        questions: {
          orderBy: { position: 'asc' },
          include: {
            question: {
              include: { options: { orderBy: { position: 'asc' } }, topics: { include: { topic: true } }, questionType: true },
            },
          },
        },
      },
    });
    if (!s || s.userId !== userId) throw new NotFoundException('Session not found');
    return { ...s, questions: s.questions.map((row) => ({ ...row, question: this.toPracticeQuestion(row.question) })) };
  }

  async submitAnswer(
    userId: string,
    sessionId: string,
    dto: SubmitAnswerDto,
  ): Promise<AnswerResponse> {
    const session = await this.prisma.quizSession.findUnique({ where: { id: sessionId } });
    if (!session || session.userId !== userId) throw new NotFoundException('Session not found');
    if (session.status !== 'IN_PROGRESS') throw new BadRequestException('Session not active');

    const sessionQuestion = await this.prisma.quizSessionQuestion.findUnique({
      where: { quizSessionId_questionId: { quizSessionId: sessionId, questionId: dto.questionId } },
    });
    if (!sessionQuestion) throw new BadRequestException('Question is not in this session');

    const existingAttempt = await this.prisma.questionAttempt.findFirst({
      where: { quizSessionId: sessionId, questionId: dto.questionId },
      orderBy: { createdAt: 'asc' },
    });
    if (existingAttempt) return this.buildAnswerResponse(existingAttempt.id, existingAttempt.isCorrect, existingAttempt.selectedOptionId, existingAttempt.hintLevelUsed, dto.questionId, dto.language);

    // Load question + all options so we can build the deterministic explanation
    // response without another round-trip.
    const question = await this.prisma.question.findUnique({
      where: { id: dto.questionId },
      include: { options: { orderBy: { position: 'asc' } } },
    });
    if (!question) throw new NotFoundException('Question not found');

    let isCorrect: boolean | null = null;
    if (dto.selectedOptionId) {
      const opt = question.options.find((o) => o.id === dto.selectedOptionId && (!o.questionId || o.questionId === question.id));
      if (!opt) throw new BadRequestException('Selected option does not belong to question');
      isCorrect = opt.isCorrect;
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

    return this.buildAnswerResponse(attempt.id, isCorrect, dto.selectedOptionId ?? null, dto.hintLevelUsed, dto.questionId, dto.language);
  }

  private async buildAnswerResponse(attemptId: string, isCorrect: boolean | null, selectedOptionId: string | null | undefined, hintLevelUsed: number, questionId: string, language: 'en' | 'vi' = 'en'): Promise<AnswerResponse> {
    const question = await this.prisma.question.findUnique({
      where: { id: questionId },
      include: { options: { orderBy: { position: 'asc' } } },
    });
    if (!question) throw new NotFoundException('Question not found');
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

    const teaching: TeachingContent = {
      explanation: question.explanation ?? null,
      wrongOptionExplanations,
      ruleStructure: question.ruleStructure ?? null,
      commonMistake: question.commonMistake ?? null,
      example: question.example ?? null,
    };
    const localized = language === 'vi' ? await this.translateTeachingContent(teaching) : teaching;
    return {
      attemptId,
      isCorrect,
      selectedOptionId: selectedOptionId ?? null,
      correctOptionId: correctOption?.id ?? null,
      correctOptionKey: correctOption?.optionKey ?? null,
      ...localized,
      hintLevelUsed,
    };
  }

  private async translateTeachingContent(content: TeachingContent): Promise<TeachingContent> {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return content;
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${encodeURIComponent(apiKey)}`, {
        method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: `Translate the following English learner teaching feedback into natural Vietnamese. Preserve meaning, grammar examples, option keys, and null values. Return JSON with exactly these keys: explanation, ruleStructure, commonMistake, example, wrongOptionExplanations. wrongOptionExplanations must remain an array of objects with optionId, optionKey, explanation. Do not translate the English question or answer options. Input JSON: ${JSON.stringify(content)}` }] }] }),
        signal: AbortSignal.timeout(6000),
      });
      if (!response.ok) return content;
      const data = await response.json() as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> };
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.replace(/^```json\s*/i, '').replace(/\s*```$/, '');
      if (!text) return content;
      const translated = JSON.parse(text) as TeachingContent;
      return translated && Array.isArray(translated.wrongOptionExplanations) ? translated : content;
    } catch {
      return content;
    }
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

    const sessionQuestion = await this.prisma.quizSessionQuestion.findUnique({
      where: { quizSessionId_questionId: { quizSessionId: sessionId, questionId } },
      include: { question: true },
    });
    if (!sessionQuestion) throw new BadRequestException('Question is not in this session');

    const current = await this.prisma.hintReveal.findUnique({
      where: { quizSessionId_questionId: { quizSessionId: sessionId, questionId } },
    });
    if (hintLevel > (current?.maxLevel ?? 0) + 1) {
      throw new BadRequestException('Reveal hints in order');
    }
    const reveal = await this.prisma.hintReveal.upsert({
      where: { quizSessionId_questionId: { quizSessionId: sessionId, questionId } },
      create: { quizSessionId: sessionId, userId, questionId, maxLevel: hintLevel },
      update: { maxLevel: { set: Math.max(hintLevel, current?.maxLevel ?? 0) } },
    });
    const question = sessionQuestion.question;
    const effectiveLevel = reveal.maxLevel;
    const hint = effectiveLevel === 1 ? question.hint1 : effectiveLevel === 2 ? question.hint2 : question.hint3;
    return { hintLevel: effectiveLevel, hint: hint ?? null };
  }

  async complete(userId: string, sessionId: string) {
    const session = await this.prisma.quizSession.findUnique({
      where: { id: sessionId },
      include: { attempts: true },
    });
    if (!session || session.userId !== userId) throw new NotFoundException('Session not found');
    const assignedQuestionIds = new Set((await this.prisma.quizSessionQuestion.findMany({
      where: { quizSessionId: sessionId },
      select: { questionId: true },
    })).map((q) => q.questionId));
    const uniqueAttempts = new Map(session.attempts
      .filter((a) => assignedQuestionIds.has(a.questionId))
      .map((a) => [a.questionId, a]));
    const correctCount = [...uniqueAttempts.values()].filter((a) => a.isCorrect === true).length;
    const total = assignedQuestionIds.size || session.totalQuestions || 1;
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
