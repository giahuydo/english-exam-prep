import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';
import { CurrentUser, AuthUser } from '../../auth/current-user.decorator';
import { CreateQuestionDto, UpdateQuestionDto, UserRole } from '@app/shared';
import { ZodValidationPipe } from '../../common/zod-validation.pipe';

@Controller('admin/questions')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class QuestionsAdminController {
  constructor(private readonly svc: QuestionsService) {}

  @Get()
  list(@Query('status') status?: string, @Query('questionTypeId') questionTypeId?: string) {
    return this.svc.list({ status, questionTypeId });
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.svc.findById(id);
  }

  @Post()
  create(
    @Body(new ZodValidationPipe(CreateQuestionDto)) dto: CreateQuestionDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.svc.create(dto, user.id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateQuestionDto)) dto: UpdateQuestionDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.svc.update(id, dto, user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.svc.remove(id);
  }
}
