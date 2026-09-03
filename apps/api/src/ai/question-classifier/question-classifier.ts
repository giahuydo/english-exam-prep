import { Injectable, NotImplementedException } from '@nestjs/common';

export interface QuestionClassification {
  topicIds: string[];
  primaryTopicId?: string;
  questionTypeId: string;
  confidence: number;
}

export interface QuestionClassifier {
  classify(question: {
    content: string;
    context?: string;
    level?: 'B1' | 'B2' | 'B1_B2';
  }): Promise<QuestionClassification>;
}
export const QUESTION_CLASSIFIER = Symbol('QUESTION_CLASSIFIER');

@Injectable()
export class NoopQuestionClassifier implements QuestionClassifier {
  async classify(_question: {
    content: string;
    context?: string;
  }): Promise<QuestionClassification> {
    throw new NotImplementedException('QuestionClassifier not implemented.');
  }
}
