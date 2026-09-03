import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { StudyPlansService } from './study-plans.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { CurrentUser, AuthUser } from '../../auth/current-user.decorator';
import { z } from 'zod';
import { ZodValidationPipe } from '../../common/zod-validation.pipe';

const StudyPlanDto = z.object({
  title: z.string().min(1),
  summary: z.string().optional(),
  generatedBy: z.enum(['AI', 'SYSTEM', 'ADMIN']).optional(),
  topics: z.array(z.object({
    topicId: z.string().uuid(), priority: z.number().int().optional(),
    targetQuestionCount: z.number().int().min(0).optional(), reason: z.string().optional(),
  })).optional(),
});

@Controller('study-plans')
@UseGuards(JwtAuthGuard)
export class StudyPlansController {
  constructor(private readonly svc: StudyPlansService) {}

  @Get()
  list(@CurrentUser() user: AuthUser) {
    return this.svc.list(user.id);
  }

  @Get(':id')
  get(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.svc.findById(user.id, id);
  }

  @Post()
  create(@CurrentUser() user: AuthUser, @Body(new ZodValidationPipe(StudyPlanDto)) dto: Parameters<StudyPlansService['create']>[1]) {
    return this.svc.create(user.id, dto);
  }

  @Delete(':id')
  remove(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.svc.remove(user.id, id);
  }
}
