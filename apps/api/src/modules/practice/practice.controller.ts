import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { PracticeService } from './practice.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { CurrentUser, AuthUser } from '../../auth/current-user.decorator';
import { RevealHintDto, StartSessionDto, SubmitAnswerDto } from '@app/shared';
import { ZodValidationPipe } from '../../common/zod-validation.pipe';

@Controller('practice/sessions')
@UseGuards(JwtAuthGuard)
export class PracticeController {
  constructor(private readonly svc: PracticeService) {}

  @Post()
  start(
    @CurrentUser() user: AuthUser,
    @Body(new ZodValidationPipe(StartSessionDto)) dto: StartSessionDto,
  ) {
    return this.svc.start(user.id, dto);
  }

  @Get(':id')
  get(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.svc.getById(user.id, id);
  }

  @Post(':id/answers')
  submit(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body(new ZodValidationPipe(SubmitAnswerDto)) dto: SubmitAnswerDto,
  ) {
    return this.svc.submitAnswer(user.id, id, dto);
  }

  @Post(':id/questions/:questionId/hint')
  hint(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Param('questionId') questionId: string,
    @Body(new ZodValidationPipe(RevealHintDto)) dto: RevealHintDto,
  ) {
    return this.svc.revealHint(user.id, id, questionId, dto.hintLevel as 1 | 2 | 3);
  }

  @Post(':id/complete')
  complete(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.svc.complete(user.id, id);
  }
}
