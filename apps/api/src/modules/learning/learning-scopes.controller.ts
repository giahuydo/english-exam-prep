import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { CurrentUser, AuthUser } from '../../auth/current-user.decorator';
import { LearningScopesService } from './learning-scopes.service';

@Controller('learning/scopes')
@UseGuards(JwtAuthGuard)
export class LearningScopesController {
  constructor(private readonly service: LearningScopesService) {}

  @Get()
  list(@CurrentUser() user: AuthUser) { return this.service.list(user.id); }

  @Get(':id/lesson')
  lesson(@CurrentUser() user: AuthUser, @Param('id') id: string) { return this.service.lesson(user.id, id); }

  @Post(':id/checkpoint')
  start(@CurrentUser() user: AuthUser, @Param('id') id: string) { return this.service.startCheckpoint(user.id, id); }

  @Post(':id/checkpoint/:sessionId/finish')
  finish(@CurrentUser() user: AuthUser, @Param('sessionId') id: string) { return this.service.finishCheckpoint(user.id, id); }

  @Get(':id/checkpoint/:sessionId/review')
  review(@CurrentUser() user: AuthUser, @Param('sessionId') id: string) { return this.service.reviewMistakes(user.id, id); }
}
