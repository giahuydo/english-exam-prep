import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { MasteryService } from './mastery.service';
import { QuestionSelectorService } from './question-selector.service';
import { MistakeReviewService } from './mistake-review.service';
import { LearningStudyPlanService } from './study-plan.service';

@Module({ imports: [PrismaModule], providers: [MasteryService, QuestionSelectorService, MistakeReviewService, LearningStudyPlanService], exports: [MasteryService, QuestionSelectorService, MistakeReviewService, LearningStudyPlanService] })
export class LearningModule {}
