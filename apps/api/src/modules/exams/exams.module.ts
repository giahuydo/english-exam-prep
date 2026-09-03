import { Module } from '@nestjs/common';
import { ExamsService } from './exams.service';
import { ExamsAdminController } from './exams.controller';

@Module({
  controllers: [ExamsAdminController],
  providers: [ExamsService],
  exports: [ExamsService],
})
export class ExamsModule {}
