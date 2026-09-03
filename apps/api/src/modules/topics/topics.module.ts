import { Module } from '@nestjs/common';
import { TopicsService } from './topics.service';
import { TopicsAdminController } from './topics.controller';

@Module({
  controllers: [TopicsAdminController],
  providers: [TopicsService],
  exports: [TopicsService],
})
export class TopicsModule {}
