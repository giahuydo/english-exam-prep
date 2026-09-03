import { Module } from '@nestjs/common';
import { ExamTypesService } from './exam-types.service';
import { ExamTypesAdminController } from './exam-types.controller';

@Module({
  controllers: [ExamTypesAdminController],
  providers: [ExamTypesService],
  exports: [ExamTypesService],
})
export class ExamTypesModule {}
