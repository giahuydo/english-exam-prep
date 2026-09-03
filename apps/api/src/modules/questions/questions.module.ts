import { Module } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { QuestionsAdminController } from './questions.controller';

@Module({
  controllers: [QuestionsAdminController],
  providers: [QuestionsService],
  exports: [QuestionsService],
})
export class QuestionsModule {}
