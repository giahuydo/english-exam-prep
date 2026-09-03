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
});
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
    return this.svc.findById(user.id, id);
  }
}
