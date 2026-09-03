// Domain enums shared across api + web. Mirror packages/database/prisma/schema.prisma.

export const UserRole = {
  USER: 'USER',
  ADMIN: 'ADMIN',
} as const;
export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export const UserStatus = {
  ACTIVE: 'ACTIVE',
  DISABLED: 'DISABLED',
} as const;
export type UserStatus = (typeof UserStatus)[keyof typeof UserStatus];

export const ExamFileStatus = {
  UPLOADED: 'UPLOADED',
  EXTRACTING: 'EXTRACTING',
  ANALYZING: 'ANALYZING',
  READY: 'READY',
  FAILED: 'FAILED',
} as const;
export type ExamFileStatus = (typeof ExamFileStatus)[keyof typeof ExamFileStatus];

export const ExamLevel = {
  B1: 'B1',
  B2: 'B2',
  B1_B2: 'B1_B2',
} as const;
export type ExamLevel = (typeof ExamLevel)[keyof typeof ExamLevel];

export const ExamStatus = {
  DRAFT: 'DRAFT',
  ANALYZED: 'ANALYZED',
  REVIEWED: 'REVIEWED',
  PUBLISHED: 'PUBLISHED',
} as const;
export type ExamStatus = (typeof ExamStatus)[keyof typeof ExamStatus];

export const TopicCategory = {
  GRAMMAR: 'GRAMMAR',
  VOCABULARY: 'VOCABULARY',
  READING: 'READING',
  LISTENING: 'LISTENING',
  WRITING: 'WRITING',
  SPEAKING: 'SPEAKING',
} as const;
export type TopicCategory = (typeof TopicCategory)[keyof typeof TopicCategory];

export const QuestionOrigin = {
  ORIGINAL: 'ORIGINAL',
  AI_GENERATED: 'AI_GENERATED',
  MANUAL: 'MANUAL',
} as const;
export type QuestionOrigin = (typeof QuestionOrigin)[keyof typeof QuestionOrigin];

export const QuestionDifficulty = {
  EASY: 'EASY',
  MEDIUM: 'MEDIUM',
  HARD: 'HARD',
} as const;
export type QuestionDifficulty = (typeof QuestionDifficulty)[keyof typeof QuestionDifficulty];

export const QuestionStatus = {
  DRAFT: 'DRAFT',
  REVIEWED: 'REVIEWED',
  PUBLISHED: 'PUBLISHED',
  ARCHIVED: 'ARCHIVED',
} as const;
export type QuestionStatus = (typeof QuestionStatus)[keyof typeof QuestionStatus];

export const QuestionTopicSource = {
  AI: 'AI',
  ADMIN: 'ADMIN',
  SYSTEM: 'SYSTEM',
} as const;
export type QuestionTopicSource = (typeof QuestionTopicSource)[keyof typeof QuestionTopicSource];

export const BlueprintStatus = {
  DRAFT: 'DRAFT',
  ACTIVE: 'ACTIVE',
  ARCHIVED: 'ARCHIVED',
} as const;
export type BlueprintStatus = (typeof BlueprintStatus)[keyof typeof BlueprintStatus];

export const QuizSessionType = {
  TOPIC_PRACTICE: 'TOPIC_PRACTICE',
  MIXED_PRACTICE: 'MIXED_PRACTICE',
  CUSTOM_PRACTICE: 'CUSTOM_PRACTICE',
  MOCK_EXAM: 'MOCK_EXAM',
} as const;
export type QuizSessionType = (typeof QuizSessionType)[keyof typeof QuizSessionType];

export const QuizSessionStatus = {
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  ABANDONED: 'ABANDONED',
} as const;
export type QuizSessionStatus = (typeof QuizSessionStatus)[keyof typeof QuizSessionStatus];

export const StudyPlanStatus = {
  ACTIVE: 'ACTIVE',
  COMPLETED: 'COMPLETED',
} as const;
export type StudyPlanStatus = (typeof StudyPlanStatus)[keyof typeof StudyPlanStatus];

export const StudyPlanGeneratedBy = {
  AI: 'AI',
  SYSTEM: 'SYSTEM',
  ADMIN: 'ADMIN',
} as const;
export type StudyPlanGeneratedBy = (typeof StudyPlanGeneratedBy)[keyof typeof StudyPlanGeneratedBy];
