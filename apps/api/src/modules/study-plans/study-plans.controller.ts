import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { StudyPlansService } from './study-plans.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { CurrentUser, AuthUser } from '../../auth/current-user.decorator';

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
  create(@CurrentUser() user: AuthUser, @Body() dto: Parameters<StudyPlansService['create']>[1]) {
    return this.svc.create(user.id, dto);
  }

  @Delete(':id')
  remove(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.svc.remove(user.id, id);
  }
}
