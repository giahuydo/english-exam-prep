import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AdminModule } from './admin/admin.module';
import { ExamFilesModule } from './modules/exam-files/exam-files.module';
import { ExamsModule } from './modules/exams/exams.module';
import { ExamTypesModule } from './modules/exam-types/exam-types.module';
import { ExamPatternsModule } from './modules/exam-patterns/exam-patterns.module';
import { TopicsModule } from './modules/topics/topics.module';
import { QuestionsModule } from './modules/questions/questions.module';
import { QuestionTypesModule } from './modules/question-types/question-types.module';
import { PracticeModule } from './modules/practice/practice.module';
import { StudyPlansModule } from './modules/study-plans/study-plans.module';
import { StorageModule } from './modules/storage/storage.module';
import { AiModule } from './ai/ai.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    StorageModule,
    AiModule,
    AuthModule,
    UsersModule,
    AdminModule,
    ExamFilesModule,
    ExamsModule,
    ExamTypesModule,
    ExamPatternsModule,
    TopicsModule,
    QuestionsModule,
    QuestionTypesModule,
    PracticeModule,
    StudyPlansModule,
  ],
})
export class AppModule {}
