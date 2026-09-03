import { Module } from '@nestjs/common';
import { ExamFilesService } from './exam-files.service';
import { ExamFilesController } from './exam-files.controller';

@Module({
  controllers: [ExamFilesController],
  providers: [ExamFilesService],
  exports: [ExamFilesService],
})
export class ExamFilesModule {}
