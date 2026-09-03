import { Injectable, NotImplementedException } from '@nestjs/common';

export interface AnalyzedExamSection {
  code: string;
  name: string;
  position: number;
  questionCount?: number;
}

export interface AnalyzedExam {
  title: string;
  detectedLevel: 'B1' | 'B2' | 'B1_B2';
  sections: AnalyzedExamSection[];
  confidence: number;
}

export interface ExamAnalyzer {
  analyze(text: string): Promise<AnalyzedExam>;
}
export const EXAM_ANALYZER = Symbol('EXAM_ANALYZER');

@Injectable()
export class NoopExamAnalyzer implements ExamAnalyzer {
  async analyze(_text: string): Promise<AnalyzedExam> {
    throw new NotImplementedException('ExamAnalyzer not implemented.');
  }
}
