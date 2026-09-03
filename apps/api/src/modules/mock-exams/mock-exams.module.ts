import { Module } from '@nestjs/common';
import { MockExamsController } from './mock-exams.controller';
import { MockExamsService } from './mock-exams.service';
import { LearningModule } from '../learning/learning.module';

@Module({
  imports: [LearningModule],
  controllers: [MockExamsController],
  providers: [MockExamsService],
  exports: [MockExamsService],
})
export class MockExamsModule {}
