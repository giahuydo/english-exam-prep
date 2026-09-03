import type { DatasetQuestion, ExamDataset, ExamLevel, QuestionDifficulty } from '../types';

type QuestionSpec = Omit<DatasetQuestion, 'key' | 'sectionCode' | 'questionTypeCode' | 'topicCodes' | 'level' | 'difficulty' | 'explanation' | 'options'> & {
  key: string;
  sectionCode: string;
  questionTypeCode: string;
  topicCodes: string[];
  level?: ExamLevel;
  difficulty?: QuestionDifficulty;
  answer: string;
  distractors: string[];
  explanation?: string;
};

export function mockQuestion(spec: QuestionSpec): DatasetQuestion {
  const options = [spec.answer, ...spec.distractors].map((content, index) => ({
    key: String.fromCharCode(65 + index),
    content,
    isCorrect: index === 0,
    explanation: index === 0 ? 'This option best fits the question.' : 'This option does not fit the context.',
  }));
  return {
    key: spec.key,
    sectionCode: spec.sectionCode,
    questionTypeCode: spec.questionTypeCode,
    topicCodes: spec.topicCodes,
    content: spec.content,
    instruction: spec.instruction,
    context: spec.context,
    level: spec.level ?? 'B1_B2',
    difficulty: spec.difficulty ?? 'MEDIUM',
    explanation: spec.explanation ?? 'Review the context and the target skill before choosing the answer.',
    options,
  };
}

export function makeMockDataset(input: Omit<ExamDataset, 'questions' | 'sourceType' | 'provenanceNotes'> & { questions: QuestionSpec[]; sourceType?: ExamDataset['sourceType']; provenanceNotes?: string }): ExamDataset {
  return {
    ...input,
    key: input.key.toLowerCase().replaceAll('_', '-'),
    sourceType: input.sourceType ?? 'SYNTHETIC_MOCK',
    provenanceNotes: input.provenanceNotes ?? 'Synthetic practice content authored for this dataset; not an official exam paper.',
    questions: input.questions.map(mockQuestion),
  };
}
