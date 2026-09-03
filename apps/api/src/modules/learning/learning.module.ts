import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { MasteryService } from './mastery.service';
import { QuestionSelectorService } from './question-selector.service';
import { MistakeReviewService } from './mistake-review.service';
import { LearningStudyPlanService } from './study-plan.service';
import { WeakTopicService } from './weak-topic.service';

@Module({ imports: [PrismaModule], providers: [MasteryService, QuestionSelectorService, MistakeReviewService, LearningStudyPlanService, WeakTopicService], exports: [MasteryService, QuestionSelectorService, MistakeReviewService, LearningStudyPlanService, WeakTopicService] })
export class LearningModule {}
