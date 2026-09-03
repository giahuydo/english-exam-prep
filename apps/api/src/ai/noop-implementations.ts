import { Injectable, NotImplementedException } from '@nestjs/common';
import type {
  AnalyzedExam,
  ExamAnalyzer,
  GeneratedQuestion,
  PdfExtractor,
  QuestionClassification,
  QuestionClassifier,
  QuestionGenerator,
} from './ai.interfaces';

@Injectable()
export class NoopPdfExtractor implements PdfExtractor {
  async extract(_fileBuffer: Buffer): Promise<string> {
    throw new NotImplementedException('PdfExtractor not implemented — plug a real backend in.');
  }
}

@Injectable()
export class NoopExamAnalyzer implements ExamAnalyzer {
  async analyze(_text: string): Promise<AnalyzedExam> {
    throw new NotImplementedException('ExamAnalyzer not implemented.');
  }
}

@Injectable()
export class NoopQuestionClassifier implements QuestionClassifier {
  async classify(_question: {
    content: string;
    context?: string;
  }): Promise<QuestionClassification> {
    throw new NotImplementedException('QuestionClassifier not implemented.');
  }
}

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
