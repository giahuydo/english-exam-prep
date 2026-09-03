import { Module } from '@nestjs/common';
import { ExamPatternsService } from './exam-patterns.service';
import { ExamPatternsAdminController } from './exam-patterns.controller';

@Module({
  controllers: [ExamPatternsAdminController],
  providers: [ExamPatternsService],
  exports: [ExamPatternsService],
})
export class ExamPatternsModule {}
