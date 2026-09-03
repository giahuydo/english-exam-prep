import { Global, Module } from '@nestjs/common';
import { PDF_EXTRACTOR, NoopPdfExtractor } from './pdf-extractor';
import { EXAM_ANALYZER, NoopExamAnalyzer } from './exam-analyzer';
import { QUESTION_CLASSIFIER, NoopQuestionClassifier } from './question-classifier';
import { QUESTION_GENERATOR, NoopQuestionGenerator } from './question-generator';
import { EXPLANATION_GENERATOR, NoopExplanationGenerator } from './explanation-generator';

@Global()
@Module({
  providers: [
    NoopPdfExtractor,
    NoopExamAnalyzer,
    NoopQuestionClassifier,
    NoopQuestionGenerator,
    NoopExplanationGenerator,
    { provide: PDF_EXTRACTOR, useExisting: NoopPdfExtractor },
    { provide: EXAM_ANALYZER, useExisting: NoopExamAnalyzer },
    { provide: QUESTION_CLASSIFIER, useExisting: NoopQuestionClassifier },
    { provide: QUESTION_GENERATOR, useExisting: NoopQuestionGenerator },
    { provide: EXPLANATION_GENERATOR, useExisting: NoopExplanationGenerator },
  ],
  exports: [
    PDF_EXTRACTOR,
    EXAM_ANALYZER,
    QUESTION_CLASSIFIER,
    QUESTION_GENERATOR,
    EXPLANATION_GENERATOR,
  ],
})
export class AiModule {}
