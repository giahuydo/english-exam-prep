import { Module } from '@nestjs/common';
import { ExamTypesService } from './exam-types.service';
import { ExamTypesAdminController, ExamTypesCatalogController } from './exam-types.controller';

@Module({
  controllers: [ExamTypesCatalogController, ExamTypesAdminController],
  providers: [ExamTypesService],
  exports: [ExamTypesService],
})
export class ExamTypesModule {}
