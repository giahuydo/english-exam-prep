import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ExamsService } from './exams.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';
import { UserRole } from '@app/shared';
import { z } from 'zod';
import { ZodValidationPipe } from '../../common/zod-validation.pipe';

const ExamDto = z.object({
  examTypeId: z.string().uuid(),
  title: z.string().min(1),
  source: z.string().min(1),
  detectedLevel: z.enum(['B1', 'B2', 'B1_B2']),
  examYear: z.number().int().optional(),
  examRound: z.string().optional(),
  durationMinutes: z.number().int().positive().optional(),
  status: z.enum(['DRAFT', 'ANALYZED', 'REVIEWED', 'PUBLISHED']).optional(),
});
const UpdateExamDto = ExamDto.partial().omit({ examTypeId: true });

@Controller('admin/exams')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class ExamsAdminController {
  constructor(private readonly svc: ExamsService) {}

  @Get()
  list() {
    return this.svc.list();
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.svc.findById(id);
  }

  @Post()
  create(@Body(new ZodValidationPipe(ExamDto)) dto: Parameters<ExamsService['create']>[0]) {
    return this.svc.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body(new ZodValidationPipe(UpdateExamDto)) dto: Parameters<ExamsService['update']>[1]) {
    return this.svc.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.svc.remove(id);
  }
}
