import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { AttemptsService } from './attempts.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { CurrentUser, AuthUser } from '../../auth/current-user.decorator';

@Controller('me/attempts')
@UseGuards(JwtAuthGuard)
export class AttemptsController {
  constructor(private readonly svc: AttemptsService) {}

  @Get()
  list(@CurrentUser() user: AuthUser, @Query('sessionId') sessionId?: string) {
    if (sessionId) return this.svc.listForSession(user.id, sessionId);
    return this.svc.listRecentForUser(user.id);
  }

  @Get(':id')
  detail(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.svc.findById(user.id, id);
  }
}
