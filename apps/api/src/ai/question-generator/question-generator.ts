import { Injectable, NotImplementedException } from '@nestjs/common';

export interface GeneratedQuestion {
  content: string;
  instruction?: string;
  context?: string;
  level: 'B1' | 'B2' | 'B1_B2';
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  options: Array<{ optionKey: string; content: string; isCorrect: boolean }>;
  hint1?: string;
  hint2?: string;
  hint3?: string;
  explanation?: string;
  aiModel?: string;
  aiGenerationMetadata?: Record<string, unknown>;
}

export interface QuestionGenerator {
  generate(blueprintItem: {
    sectionCode: string;
    topicId?: string;
    questionTypeId?: string;
    difficulty?: 'EASY' | 'MEDIUM' | 'HARD';
    level?: 'B1' | 'B2' | 'B1_B2';
  }): Promise<GeneratedQuestion>;
}
export const QUESTION_GENERATOR = Symbol('QUESTION_GENERATOR');

@Injectable()
export class NoopQuestionGenerator implements QuestionGenerator {
  async generate(_item: {
    sectionCode: string;
    topicId?: string;
    questionTypeId?: string;
  }): Promise<GeneratedQuestion> {
    throw new NotImplementedException('QuestionGenerator not implemented.');
  }
}
