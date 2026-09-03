import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { MockExamsService } from './mock-exams.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { CurrentUser, AuthUser } from '../../auth/current-user.decorator';
import { z } from 'zod';
import { ZodValidationPipe } from '../../common/zod-validation.pipe';

const StartMockExamDto = z.object({
  examTypeId: z.string().uuid(),
  blueprintId: z.string().uuid().optional(),
  totalQuestions: z.number().int().min(1).max(200).optional(),
  durationSeconds: z.number().int().min(60).max(24 * 60 * 60).optional(),
});
const SaveAnswerDto = z.object({ questionId: z.string().uuid(), selectedOptionId: z.string().uuid().optional(), answerText: z.string().optional(), currentQuestionIndex: z.number().int().min(0).optional() });
type StartMockExamDto = z.infer<typeof StartMockExamDto>;

@Controller('mock-exams')
@UseGuards(JwtAuthGuard)
export class MockExamsController {
  constructor(private readonly svc: MockExamsService) {}

  @Get('blueprints')
  blueprints(@Query('examTypeId') examTypeId?: string) {
    return this.svc.listBlueprints(examTypeId);
  }

  @Post()
  start(
    @CurrentUser() user: AuthUser,
    @Body(new ZodValidationPipe(StartMockExamDto)) dto: StartMockExamDto,
  ) {
    return this.svc.start(user.id, dto);
  }

  @Get()
  list(@CurrentUser() user: AuthUser) {
    return this.svc.listForUser(user.id);
  }

  @Get(':id')
  detail(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.svc.state(user.id, id);
  }

  @Post(':id/answers')
  saveAnswer(@CurrentUser() user: AuthUser, @Param('id') id: string, @Body(new ZodValidationPipe(SaveAnswerDto)) dto: z.infer<typeof SaveAnswerDto>) {
    return this.svc.saveAnswer(user.id, id, dto);
  }

  @Post(':id/pause')
  pause(@CurrentUser() user: AuthUser, @Param('id') id: string) { return this.svc.pause(user.id, id); }

  @Post(':id/resume')
  resume(@CurrentUser() user: AuthUser, @Param('id') id: string) { return this.svc.resume(user.id, id); }

  @Post(':id/submit')
  submit(@CurrentUser() user: AuthUser, @Param('id') id: string) { return this.svc.submit(user.id, id); }
}
