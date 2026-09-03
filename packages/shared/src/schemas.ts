import { z } from 'zod';
import {
  ExamLevel,
  QuestionDifficulty,
  QuestionOrigin,
  QuestionStatus,
  QuestionTopicSource,
  TopicCategory,
} from './enums';

const enumFromConst = <T extends Record<string, string>>(obj: T) =>
  z.enum(Object.values(obj) as [string, ...string[]]);

// ---- Auth ----
export const LoginDto = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
export type LoginDto = z.infer<typeof LoginDto>;

export const RegisterDto = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1),
});
export type RegisterDto = z.infer<typeof RegisterDto>;

// ---- Topic ----
export const CreateTopicDto = z.object({
  code: z.string().min(1),
  name: z.string().min(1),
  category: enumFromConst(TopicCategory),
  parentId: z.string().uuid().optional(),
  level: z.string().optional(),
  sortOrder: z.number().int().optional(),
});
export type CreateTopicDto = z.infer<typeof CreateTopicDto>;

// ---- Question ----
export const QuestionOptionInput = z.object({
  optionKey: z.string().min(1),
  content: z.string().min(1),
  isCorrect: z.boolean().default(false),
  explanation: z.string().optional(),
  position: z.number().int().default(0),
});
export type QuestionOptionInput = z.infer<typeof QuestionOptionInput>;

export const CreateQuestionDto = z.object({
  examId: z.string().uuid().optional(),
  examSectionId: z.string().uuid().optional(),
  questionTypeId: z.string().uuid(),
  origin: enumFromConst(QuestionOrigin).default(QuestionOrigin.MANUAL),
  content: z.string().min(1),
  instruction: z.string().optional(),
  context: z.string().optional(),
  level: enumFromConst(ExamLevel),
  difficulty: enumFromConst(QuestionDifficulty).default(QuestionDifficulty.MEDIUM),
  hint1: z.string().optional(),
  hint2: z.string().optional(),
  hint3: z.string().optional(),
  explanation: z.string().optional(),
  status: enumFromConst(QuestionStatus).optional(),
  aiModel: z.string().optional(),
  aiGenerationMetadata: z.record(z.unknown()).optional(),
  primaryTopicId: z.string().uuid().optional(),
  secondaryTopicIds: z.array(z.string().uuid()).default([]),
  topicSource: enumFromConst(QuestionTopicSource).default(QuestionTopicSource.ADMIN),
  options: z.array(QuestionOptionInput).default([]),
});
export type CreateQuestionDto = z.infer<typeof CreateQuestionDto>;

export const UpdateQuestionDto = CreateQuestionDto.partial();
export type UpdateQuestionDto = z.infer<typeof UpdateQuestionDto>;

// ---- Practice ----
export const StartSessionDto = z.object({
  type: z
    .enum(['TOPIC_PRACTICE', 'MIXED_PRACTICE', 'CUSTOM_PRACTICE', 'MOCK_EXAM'])
    .default('MIXED_PRACTICE'),
  examTypeId: z.string().uuid().optional(),
  blueprintId: z.string().uuid().optional(),
  topicId: z.string().uuid().optional(),
  topicIds: z.array(z.string().uuid()).default([]),
  level: enumFromConst(ExamLevel).optional(),
  difficulty: enumFromConst(QuestionDifficulty).optional(),
  totalQuestions: z.number().int().min(1).max(200).default(10),
});
export type StartSessionDto = z.infer<typeof StartSessionDto>;

export const SubmitAnswerDto = z.object({
  questionId: z.string().uuid(),
  selectedOptionId: z.string().uuid().optional(),
  answerText: z.string().optional(),
  hintLevelUsed: z.number().int().min(0).max(3).default(0),
  timeSpentSeconds: z.number().int().min(0).optional(),
});
export type SubmitAnswerDto = z.infer<typeof SubmitAnswerDto>;
