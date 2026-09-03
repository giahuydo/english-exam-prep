import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { MistakeReviewService } from '../learning/mistake-review.service';
import { WeakTopicService } from '../learning/weak-topic.service';

export type ResultAction = 'REVIEW_MISTAKES' | 'PRACTICE_WEAK_TOPICS' | 'CONTINUE_NEXT_SCOPE';

@Injectable()
export class ResultsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mistakes: MistakeReviewService,
    private readonly weakTopics: WeakTopicService,
  ) {}

  async get(userId: string, sessionId: string) {
    const session = await this.prisma.quizSession.findFirst({
      where: { id: sessionId, userId },
      include: {
        attempts: { include: { question: { include: { topics: { include: { topic: true } }, examSection: true } } } },
        questions: { include: { question: { include: { topics: { include: { topic: true } }, examSection: true } } } },
      },
    });
    if (!session) throw new NotFoundException('Session not found');

    const attempts = session.attempts;
    const total = session.totalQuestions || session.questions.length || attempts.length;
    const correct = attempts.filter((a) => a.isCorrect === true).length;
    const score = total ? correct / total : 0;
    const sections = new Map<string, { name: string; correct: number; total: number }>();
    const topics = new Map<string, { name: string; correct: number; total: number }>();
    for (const item of session.questions) {
      const attempt = attempts.find((a) => a.questionId === item.questionId);
      const section = item.question.examSection;
      if (section) {
        const row = sections.get(section.id) ?? { name: section.name, correct: 0, total: 0 };
        row.total++;
        if (attempt?.isCorrect) row.correct++;
        sections.set(section.id, row);
      }
      for (const link of item.question.topics) {
        const row = topics.get(link.topicId) ?? { name: link.topic.name, correct: 0, total: 0 };
        row.total++;
        if (attempt?.isCorrect) row.correct++;
        topics.set(link.topicId, row);
      }
    }
    const weakTopics = await this.weakTopics.list(userId);
    const recentMistakes = await this.mistakes.list(userId, 5);
    const actions: ResultAction[] = [];
    if (recentMistakes.length) actions.push('REVIEW_MISTAKES');
    if (weakTopics.length) actions.push('PRACTICE_WEAK_TOPICS');
    actions.push('CONTINUE_NEXT_SCOPE');
    return {
      sessionId: session.id,
      type: session.type,
      status: session.status,
      score,
      correctCount: correct,
      totalQuestions: total,
      sections: [...sections].map(([id, row]) => ({ id, ...row, accuracy: row.total ? row.correct / row.total : 0 })),
      topics: [...topics].map(([id, row]) => ({ id, ...row, accuracy: row.total ? row.correct / row.total : 0 })),
      weakTopics: weakTopics.map((s) => ({ topicId: s.topicId, topic: s.topic.name, accuracy: s.accuracy, attemptCount: s.attemptCount })),
      recentMistakes: recentMistakes.map((a) => ({ attemptId: a.id, questionId: a.questionId, createdAt: a.createdAt })),
      actions,
    };
  }
}
