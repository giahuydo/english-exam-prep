import { Injectable, NotImplementedException } from '@nestjs/common';

export interface ExplanationRequest {
  questionId: string;
  questionContent: string;
  selectedOptionKey?: string;
  correctOptionKey?: string;
  optionExplanations?: Array<{ optionKey: string; explanation?: string | null; isCorrect: boolean }>;
  storedExplanation?: string | null;
  language?: 'en' | 'vi';
}

export interface GeneratedExplanation {
  mainExplanation: string;
  wrongOptionExplanations: Array<{ optionKey: string; explanation: string }>;
  aiModel?: string;
  aiGenerationMetadata?: Record<string, unknown>;
}

/**
 * Optional AI hook for producing an "answer explanation" bundle.
 *
 * The runtime deterministic-answer flow (see PracticeService.submitAnswer)
 * uses stored per-option and per-question `explanation` fields directly and
 * does NOT invoke this. This interface exists so an admin can later trigger
 * "regenerate explanation" against a question row.
 */
export interface ExplanationGenerator {
  generate(req: ExplanationRequest): Promise<GeneratedExplanation>;
}
export const EXPLANATION_GENERATOR = Symbol('EXPLANATION_GENERATOR');

@Injectable()
export class NoopExplanationGenerator implements ExplanationGenerator {
  async generate(_req: ExplanationRequest): Promise<GeneratedExplanation> {
    throw new NotImplementedException(
      'ExplanationGenerator not implemented — deterministic runtime path uses stored explanations.',
    );
  }
}
