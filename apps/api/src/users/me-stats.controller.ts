import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser, AuthUser } from '../auth/current-user.decorator';
import { UpdateStudyTargetDto } from '@app/shared';
import { ZodValidationPipe } from '../common/zod-validation.pipe';
import { MistakeReviewService } from '../modules/learning/mistake-review.service';

@Controller('me')
@UseGuards(JwtAuthGuard)
export class MeStatsController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mistakes: MistakeReviewService,
  ) {}

  @Get('stats')
  stats(@CurrentUser() user: AuthUser) {
    return this.prisma.userTopicStat.findMany({
      where: { userId: user.id },
      include: { topic: { select: { code: true, name: true, category: true } } },
      orderBy: { updatedAt: 'desc' },
    });
  }

  @Get('mistakes')
  listMistakes(@CurrentUser() user: AuthUser) {
    return this.mistakes.list(user.id);
  }

  @Patch('study-target')
  async updateStudyTarget(
    @CurrentUser() user: AuthUser,
    @Body(new ZodValidationPipe(UpdateStudyTargetDto)) dto: UpdateStudyTargetDto,
  ) {
    return this.prisma.user.update({
      where: { id: user.id },
      data: { currentExamTypeId: dto.examTypeId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        currentExamTypeId: true,
        currentExamType: { select: { id: true, code: true, name: true } },
      },
    });
  }

  @Get('dashboard')
  async dashboard(@CurrentUser() user: AuthUser) {
    const [profile, recentSessions, recentAttempts, weakTopics, mistakeCount] = await Promise.all([
      this.prisma.user.findUnique({
        where: { id: user.id },
        select: {
          id: true,
          email: true,
          name: true,
          currentExamTypeId: true,
          currentExamType: { select: { id: true, code: true, name: true } },
        },
      }),
      this.prisma.quizSession.findMany({
        where: { userId: user.id },
        orderBy: { startedAt: 'desc' },
        take: 5,
        select: {
          id: true,
          type: true,
          status: true,
          score: true,
          totalQuestions: true,
          correctCount: true,
          startedAt: true,
          completedAt: true,
        },
      }),
      this.prisma.questionAttempt.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
        take: 10,
        select: {
          id: true,
          questionId: true,
          isCorrect: true,
          hintLevelUsed: true,
          createdAt: true,
        },
      }),
      this.prisma.userTopicStat.findMany({
        where: { userId: user.id, attemptCount: { gt: 0 } },
        orderBy: [{ masteryScore: 'asc' }, { accuracy: 'asc' }],
        take: 5,
        include: { topic: { select: { id: true, code: true, name: true, category: true } } },
      }),
      this.prisma.questionAttempt
        .findMany({
          where: { userId: user.id, isCorrect: false },
          distinct: ['questionId'],
          select: { questionId: true },
        })
        .then((rows) => rows.length),
    ]);

    return {
      profile,
      recentSessions,
      recentAttempts,
      weakTopics,
      mistakeCount,
    };
  }
}
