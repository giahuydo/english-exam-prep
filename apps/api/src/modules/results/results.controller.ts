import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { CurrentUser, AuthUser } from '../../auth/current-user.decorator';
import { ResultsService } from './results.service';

@Controller('me/results')
@UseGuards(JwtAuthGuard)
export class ResultsController {
  constructor(private readonly service: ResultsService) {}

  @Get(':sessionId')
  get(@CurrentUser() user: AuthUser, @Param('sessionId') sessionId: string) {
    return this.service.get(user.id, sessionId);
  }
}
