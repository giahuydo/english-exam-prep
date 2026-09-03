import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { MeStatsController } from './me-stats.controller';

@Module({
  controllers: [UsersController, MeStatsController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
