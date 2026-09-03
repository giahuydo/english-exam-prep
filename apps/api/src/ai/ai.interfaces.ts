/**
 * Provider-agnostic AI extension points. No OpenAI/Gemini/Anthropic SDKs
 * imported anywhere. Real implementations plug in later.
 */

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

export interface QuestionClassification {
  topicIds: string[];
  primaryTopicId?: string;
  questionTypeId: string;
  confidence: number;
}

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

export interface PdfExtractor {
  extract(fileBuffer: Buffer): Promise<string>;
}
export const PDF_EXTRACTOR = Symbol('PDF_EXTRACTOR');

export interface ExamAnalyzer {
  analyze(text: string): Promise<AnalyzedExam>;
}
export const EXAM_ANALYZER = Symbol('EXAM_ANALYZER');

export interface QuestionClassifier {
  classify(question: {
    content: string;
    context?: string;
    level?: 'B1' | 'B2' | 'B1_B2';
  }): Promise<QuestionClassification>;
}
export const QUESTION_CLASSIFIER = Symbol('QUESTION_CLASSIFIER');

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
