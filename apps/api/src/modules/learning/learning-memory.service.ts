import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

type Confidence = 'KNOW' | 'UNSURE' | 'GUESS';
type Action = 'ANSWERED' | 'AGAIN' | 'ADVANCE';

export function scheduleMemory(input: { now: Date; correct: boolean; confidence: Confidence; action?: Action; reviewCount?: number; streak?: number; ease?: number }) {
  const count = input.reviewCount ?? 0;
  const previousStreak = input.streak ?? 0;
  const previousEase = input.ease ?? 2.5;
  if (input.action === 'AGAIN' || !input.correct || input.confidence === 'GUESS') return { nextReviewAt: input.now, reviewCount: count + 1, streak: 0, ease: Math.max(1.3, previousEase - 0.2), state: 'LEARNING' as const };
  const days = input.confidence === 'UNSURE' ? 1 : count < 1 ? 1 : previousStreak >= 2 ? Math.min(14, Math.max(3, Math.round(previousEase * (previousStreak + 1)))) : 3;
  return { nextReviewAt: new Date(input.now.getTime() + days * 86400000), reviewCount: count + 1, streak: previousStreak + 1, ease: Math.min(3.2, previousEase + (input.confidence === 'KNOW' ? 0.05 : 0)), state: days >= 7 ? 'STRONG' as const : 'LEARNING' as const };
}

@Injectable()
export class LearningMemoryService {
  constructor(private readonly prisma: PrismaService) {}
  async recordQuestion(userId: string, questionId: string, input: { correct: boolean; confidence: Confidence; action?: Action; errorTag?: string | null }) {
    const old = await this.prisma.learningMemory.findUnique({ where: { userId_questionId: { userId, questionId } } });
    const scheduled = scheduleMemory({ now: new Date(), ...input, reviewCount: old?.reviewCount, streak: old?.streak, ease: old?.ease });
    return this.prisma.learningMemory.upsert({ where: { userId_questionId: { userId, questionId } }, create: { userId, questionId, confidence: input.confidence, ...scheduled, lastReviewedAt: new Date(), errorTag: input.errorTag }, update: { confidence: input.confidence, ...scheduled, lastReviewedAt: new Date(), errorTag: input.errorTag } });
  }
  async recordVocabulary(userId: string, vocabularyKey: string, confidence: Confidence, action: Action = 'ANSWERED') {
    const old = await this.prisma.learningMemory.findUnique({ where: { userId_vocabularyKey: { userId, vocabularyKey } } });
    const scheduled = scheduleMemory({ now: new Date(), correct: confidence !== 'GUESS', confidence, action, reviewCount: old?.reviewCount, streak: old?.streak, ease: old?.ease });
    return this.prisma.learningMemory.upsert({ where: { userId_vocabularyKey: { userId, vocabularyKey } }, create: { userId, vocabularyKey, confidence, source: 'VOCABULARY', ...scheduled, lastReviewedAt: new Date() }, update: { confidence, source: 'VOCABULARY', ...scheduled, lastReviewedAt: new Date() } });
  }
  due(userId: string, take = 20) { return this.prisma.learningMemory.findMany({ where: { userId, nextReviewAt: { lte: new Date() } }, orderBy: [{ nextReviewAt: 'asc' }, { ease: 'asc' }], take, include: { question: { include: { questionType: true, topics: { include: { topic: true } } } } } }); }
  list(userId: string, take = 50) { return this.prisma.learningMemory.findMany({ where: { userId }, orderBy: [{ nextReviewAt: 'asc' }, { ease: 'asc' }], take, include: { question: { include: { questionType: true, topics: { include: { topic: true } } } } } }); }
  async again(userId: string, id: string) { const item = await this.prisma.learningMemory.findFirst({ where: { id, userId } }); if (!item) throw new NotFoundException('Learning memory not found'); const scheduled = scheduleMemory({ now: new Date(), correct: false, confidence: item.confidence as Confidence, action: 'AGAIN', reviewCount: item.reviewCount, streak: item.streak, ease: item.ease }); return this.prisma.learningMemory.update({ where: { id }, data: scheduled }); }
}
