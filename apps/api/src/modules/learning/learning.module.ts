import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { MasteryService } from './mastery.service';
import { QuestionSelectorService } from './question-selector.service';
import { MistakeReviewService } from './mistake-review.service';
import { LearningStudyPlanService } from './study-plan.service';
import { WeakTopicService } from './weak-topic.service';
import { LearningMemoryService } from './learning-memory.service';
import { LearningMemoryController } from './learning-memory.controller';

@Module({ imports: [PrismaModule], controllers: [LearningMemoryController], providers: [MasteryService, QuestionSelectorService, MistakeReviewService, LearningStudyPlanService, WeakTopicService, LearningMemoryService], exports: [MasteryService, QuestionSelectorService, MistakeReviewService, LearningStudyPlanService, WeakTopicService, LearningMemoryService] })
export class LearningModule {}
