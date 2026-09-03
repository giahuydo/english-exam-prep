import { Module } from '@nestjs/common';
import { QuestionTypesService } from './question-types.service';
import { QuestionTypesAdminController } from './question-types.controller';

@Module({
  controllers: [QuestionTypesAdminController],
  providers: [QuestionTypesService],
  exports: [QuestionTypesService],
})
export class QuestionTypesModule {}
