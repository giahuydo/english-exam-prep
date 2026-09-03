import { Module } from '@nestjs/common';

/**
 * Umbrella module for admin surface — actual admin routes are exposed by
 * TopicsModule, QuestionsModule, ExamsModule, etc. under the /admin prefix
 * and guarded via RolesGuard.
 */
@Module({})
export class AdminModule {}
