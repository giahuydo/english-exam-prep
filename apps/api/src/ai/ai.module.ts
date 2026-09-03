import { Global, Module } from '@nestjs/common';
import {
  EXAM_ANALYZER,
  PDF_EXTRACTOR,
  QUESTION_CLASSIFIER,
  QUESTION_GENERATOR,
} from './ai.interfaces';
import {
  NoopExamAnalyzer,
  NoopPdfExtractor,
  NoopQuestionClassifier,
  NoopQuestionGenerator,
} from './noop-implementations';

@Global()
@Module({
  providers: [
    NoopPdfExtractor,
    NoopExamAnalyzer,
    NoopQuestionClassifier,
    NoopQuestionGenerator,
    { provide: PDF_EXTRACTOR, useExisting: NoopPdfExtractor },
    { provide: EXAM_ANALYZER, useExisting: NoopExamAnalyzer },
    { provide: QUESTION_CLASSIFIER, useExisting: NoopQuestionClassifier },
    { provide: QUESTION_GENERATOR, useExisting: NoopQuestionGenerator },
  ],
  exports: [PDF_EXTRACTOR, EXAM_ANALYZER, QUESTION_CLASSIFIER, QUESTION_GENERATOR],
})
export class AiModule {}
