import { Module } from '@nestjs/common';
import { LearningModule } from '../learning/learning.module';
import { PrismaModule } from '../../prisma/prisma.module';
import { ResultsController } from './results.controller';
import { ResultsService } from './results.service';

@Module({ imports: [PrismaModule, LearningModule], controllers: [ResultsController], providers: [ResultsService] })
export class ResultsModule {}
