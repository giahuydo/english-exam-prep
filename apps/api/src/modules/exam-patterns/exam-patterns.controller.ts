import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ExamPatternsService } from './exam-patterns.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';
import { UserRole } from '@app/shared';
import { z } from 'zod';
import { ZodValidationPipe } from '../../common/zod-validation.pipe';

const BlueprintItemDto = z.object({
  sectionCode: z.string().min(1),
  questionTypeId: z.string().uuid().optional(),
  topicId: z.string().uuid().optional(),
  questionCount: z.number().int().min(0).optional(),
  weight: z.number().nonnegative().optional(),
  difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']).optional(),
  level: z.enum(['B1', 'B2', 'B1_B2']).optional(),
});
const BlueprintDto = z.object({
  examTypeId: z.string().uuid(), name: z.string().min(1), version: z.string().min(1),
  status: z.enum(['DRAFT', 'ACTIVE', 'ARCHIVED']).optional(),
  sourceExamCount: z.number().int().min(0).optional(), items: z.array(BlueprintItemDto).optional(),
});
const UpdateBlueprintDto = BlueprintDto.partial().omit({ examTypeId: true });

@Controller('admin/blueprints')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class ExamPatternsAdminController {
  constructor(private readonly svc: ExamPatternsService) {}

  @Get()
  list() {
    return this.svc.list();
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.svc.findById(id);
  }

  @Post()
  create(@Body(new ZodValidationPipe(BlueprintDto)) dto: Parameters<ExamPatternsService['create']>[0]) {
    return this.svc.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body(new ZodValidationPipe(UpdateBlueprintDto)) dto: Parameters<ExamPatternsService['update']>[1]) {
    return this.svc.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.svc.remove(id);
  }
}
