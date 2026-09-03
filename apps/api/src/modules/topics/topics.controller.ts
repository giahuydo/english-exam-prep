import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { TopicsService } from './topics.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';
import { CreateTopicDto, UserRole } from '@app/shared';
import { ZodValidationPipe } from '../../common/zod-validation.pipe';

@Controller('admin/topics')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class TopicsAdminController {
  constructor(private readonly svc: TopicsService) {}

  @Get()
  list() {
    return this.svc.listFlat();
  }

  @Get('tree')
  tree() {
    return this.svc.tree();
  }

  @Post()
  create(@Body(new ZodValidationPipe(CreateTopicDto)) dto: CreateTopicDto) {
    return this.svc.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: Partial<CreateTopicDto>) {
    return this.svc.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.svc.softDelete(id);
  }
}
