import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { QuestionSelectorService } from './question-selector.service';

const CHECKPOINT_SIZE = 5;
const PASS_SCORE = 4; // centralized policy: 4/5 initially

@Injectable()
export class LearningScopesService {
  constructor(private readonly prisma: PrismaService, private readonly selector: QuestionSelectorService) {}

  list(userId: string) {
    return this.prisma.learningScope.findMany({
      where: { isActive: true },
      orderBy: [{ position: 'asc' }, { name: 'asc' }],
      include: { progress: { where: { userId } }, parent: { select: { id: true, code: true, name: true } } },
    });
  }

  async lesson(userId: string, scopeId: string) {
    const scope = await this.prisma.learningScope.findUnique({ where: { id: scopeId }, include: { progress: { where: { userId } } } });
    if (!scope || !scope.isActive) throw new NotFoundException('Learning scope not found');
    return { scope, progress: scope.progress[0] ?? { status: 'NOT_STARTED', lastScore: null, attemptCount: 0 } };
  }

  async startCheckpoint(userId: string, scopeId: string) {
    const scope = await this.prisma.learningScope.findUnique({ where: { id: scopeId } });
    if (!scope || !scope.isActive) throw new NotFoundException('Learning scope not found');
    const questions = await this.selector.select({ topicIds: [scope.topicId], take: CHECKPOINT_SIZE });
    if (questions.length < CHECKPOINT_SIZE) throw new BadRequestException('Not enough checkpoint questions for this scope');
    const session = await this.prisma.quizSession.create({ data: { userId, type: 'TOPIC_PRACTICE', learningScopeId: scope.id, checkpointSize: CHECKPOINT_SIZE, passScore: PASS_SCORE, totalQuestions: CHECKPOINT_SIZE } });
    await this.prisma.quizSessionQuestion.createMany({ data: questions.map((q, position) => ({ quizSessionId: session.id, questionId: q.id, position })) });
    await this.prisma.userLearningScope.upsert({ where: { userId_scopeId: { userId, scopeId } }, update: { status: 'IN_PROGRESS' }, create: { userId, scopeId, status: 'IN_PROGRESS' } });
    return { session, scope, questions };
  }

  async finishCheckpoint(userId: string, sessionId: string) {
    const session = await this.prisma.quizSession.findUnique({ where: { id: sessionId }, include: { attempts: true, learningScope: true } });
    if (!session || session.userId !== userId || !session.learningScopeId) throw new NotFoundException('Checkpoint not found');
    if (session.status === 'COMPLETED') return session;
    const correctCount = session.attempts.filter((attempt) => attempt.isCorrect === true).length;
    const passed = correctCount >= (session.passScore ?? PASS_SCORE);
    const updated = await this.prisma.quizSession.update({ where: { id: sessionId }, data: { status: 'COMPLETED', completedAt: new Date(), correctCount, score: correctCount / (session.checkpointSize ?? CHECKPOINT_SIZE) } });
    await this.prisma.userLearningScope.update({ where: { userId_scopeId: { userId, scopeId: session.learningScopeId } }, data: { status: passed ? 'PASSED' : 'NEEDS_REVIEW', lastScore: correctCount, attemptCount: { increment: 1 } } });
    return { session: updated, passed, correctCount, passScore: session.passScore ?? PASS_SCORE, next: passed ? 'NEXT_SCOPE' : 'REVIEW_MISTAKES' };
  }

  reviewMistakes(userId: string, sessionId: string) {
    return this.prisma.questionAttempt.findMany({ where: { userId, quizSessionId: sessionId, isCorrect: false }, include: { question: { include: { options: true, topics: { include: { topic: true } }, questionType: true } }, selectedOption: true }, orderBy: { createdAt: 'asc' } });
  }
}
