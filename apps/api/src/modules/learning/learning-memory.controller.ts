import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { z } from 'zod';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { CurrentUser, AuthUser } from '../../auth/current-user.decorator';
import { ZodValidationPipe } from '../../common/zod-validation.pipe';
import { LearningMemoryService } from './learning-memory.service';

const MemoryDto = z.object({ confidence: z.enum(['KNOW', 'UNSURE', 'GUESS']), correct: z.boolean(), action: z.enum(['ANSWERED', 'AGAIN', 'ADVANCE']).optional(), errorTag: z.string().max(80).nullable().optional() });
const VocabularyDto = z.object({ vocabularyKey: z.string().min(1).max(120), confidence: z.enum(['KNOW', 'UNSURE', 'GUESS']), action: z.enum(['ANSWERED', 'AGAIN', 'ADVANCE']).optional() });
@Controller('me/learning-memory')
@UseGuards(JwtAuthGuard)
export class LearningMemoryController {
  constructor(private readonly service: LearningMemoryService) {}
  @Get('due') due(@CurrentUser() user: AuthUser) { return this.service.due(user.id); }
  @Get() list(@CurrentUser() user: AuthUser) { return this.service.list(user.id); }
  @Post('questions/:questionId') record(@CurrentUser() user: AuthUser, @Param('questionId') questionId: string, @Body(new ZodValidationPipe(MemoryDto)) dto: z.infer<typeof MemoryDto>) { return this.service.recordQuestion(user.id, questionId, dto); }
  @Post('vocabulary') vocabulary(@CurrentUser() user: AuthUser, @Body(new ZodValidationPipe(VocabularyDto)) dto: z.infer<typeof VocabularyDto>) { return this.service.recordVocabulary(user.id, dto.vocabularyKey, dto.confidence, dto.action); }
  @Post(':id/again') again(@CurrentUser() user: AuthUser, @Param('id') id: string) { return this.service.again(user.id, id); }
}
