import { Controller, Get, UseGuards } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser, AuthUser } from '../auth/current-user.decorator';

@Controller('me')
@UseGuards(JwtAuthGuard)
export class MeStatsController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('stats')
  stats(@CurrentUser() user: AuthUser) {
    return this.prisma.userTopicStat.findMany({
      where: { userId: user.id },
      include: { topic: { select: { code: true, name: true, category: true } } },
      orderBy: { updatedAt: 'desc' },
    });
  }
}
