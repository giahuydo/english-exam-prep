import { Module } from '@nestjs/common';
import { LearningScopesController } from './learning-scopes.controller';
import { LearningScopesService } from './learning-scopes.service';
import { QuestionSelectorService } from './question-selector.service';

@Module({ controllers: [LearningScopesController], providers: [LearningScopesService, QuestionSelectorService] })
export class LearningScopesModule {}
