import type { PrismaClient } from '../../src/generated/prisma';

export type SeedDb = any;
export type TopicCategory = 'GRAMMAR' | 'VOCABULARY' | 'READING' | 'LISTENING' | 'WRITING' | 'SPEAKING';
export type ExamLevel = 'B1' | 'B2' | 'C1' | 'B1_B2' | 'B1_C1';
export type QuestionDifficulty = 'EASY' | 'MEDIUM' | 'HARD';
export type SourceType = 'OFFICIAL_SAMPLE' | 'RECONSTRUCTED' | 'SYNTHETIC_MOCK' | 'ORIGINAL' | 'AI_GENERATED';
export type ProvenanceKind = 'SOURCE' | 'ADMIN' | 'AI_ENRICHED' | 'SYSTEM';
export type FieldProvenance = { kind: ProvenanceKind; reference?: string; confidence?: number; model?: string; note?: string };
export type DatasetOption = { key: string; content: string; isCorrect: boolean; explanation?: string; provenance?: FieldProvenance };
export type DatasetGroup = { key: string; kind: 'PASSAGE' | 'LISTENING' | 'OTHER'; title?: string; stimulus?: string; audioReference?: string; transcript?: string; sourceReference?: string; provenanceNotes?: string; provenance?: FieldProvenance };
export type DatasetQuestion = { key: string; partCode?: string; sectionCode?: string; questionTypeCode: string; topicCodes: string[]; content: string; instruction?: string; context?: string; level: ExamLevel; difficulty?: QuestionDifficulty; hint1?: string; hint2?: string; hint3?: string; explanation?: string; options?: DatasetOption[]; groupKey?: string; sourceType?: SourceType; sourceYear?: number; sourceCenter?: string; sourceOrg?: string; sourceReference?: string; provenanceNotes?: string; provenance?: { content?: FieldProvenance; answer?: FieldProvenance; passage?: FieldProvenance; hints?: FieldProvenance; explanation?: FieldProvenance; fields?: Record<string, FieldProvenance> } };
export type DatasetSection = { code: string; name: string; position: number; questionCount?: number; partCount?: number; passageCount?: number; taskCount?: number; durationMinutes?: number };
export type ExamDataset = { schemaVersion?: 'exam-dataset/v1'; key: string; examTypeCode: 'HCMUS_MASTER_ENTRANCE' | 'VSTEP' | 'B1' | 'B2'; framework?: 'VSTEP'; orientation?: 'HCMUS'; title: string; source: string; sourceType: SourceType; sourceYear?: number; sourceCenter?: string; sourceOrg?: string; sourceReference?: string; sourceUrl?: string; provenanceNotes: string; detectedLevel: ExamLevel; blueprintKey?: string; sourceDocument?: { fileId?: string; originalName?: string; mimeType?: string; checksum?: string; pageCount?: number }; sections: DatasetSection[]; questions: DatasetQuestion[]; groups?: DatasetGroup[] };

export type DatasetValidationFlag = { code: 'MISSING_ANSWER' | 'LOW_CONFIDENCE' | 'UNKNOWN_TYPE' | 'DUPLICATE'; severity: 'ERROR' | 'WARNING'; path: string; message: string };

const knownQuestionTypes = new Set(['MCQ_SINGLE_BLANK', 'ERROR_RECOGNITION', 'VOCABULARY_IN_CONTEXT', 'VOCABULARY_MCQ', 'READING_COMPREHENSION', 'ANNOUNCEMENT_INSTRUCTION', 'CONVERSATION', 'TALK_LECTURE', 'LISTENING_MCQ', 'LETTER_EMAIL', 'ESSAY', 'SOCIAL_INTERACTION', 'SOLUTION_DISCUSSION', 'TOPIC_DEVELOPMENT']);

export function datasetValidationFlags(dataset: ExamDataset): DatasetValidationFlag[] {
  const flags: DatasetValidationFlag[] = [];
  const seen = new Set<string>();
  dataset.questions.forEach((question, index) => {
    const path = `questions[${index}]`;
    if (seen.has(question.key)) flags.push({ code: 'DUPLICATE', severity: 'ERROR', path, message: `Duplicate question key ${question.key}` });
    seen.add(question.key);
    if (!question.options?.length && ['MCQ', 'CLOZE', 'COMPREHENSION', 'LISTENING'].some((kind) => question.questionTypeCode.toUpperCase().includes(kind))) flags.push({ code: 'MISSING_ANSWER', severity: 'ERROR', path, message: `${question.key} has no answer options` });
    if (!knownQuestionTypes.has(question.questionTypeCode)) flags.push({ code: 'UNKNOWN_TYPE', severity: 'ERROR', path, message: `Unknown question type ${question.questionTypeCode}` });
    const confidence = question.provenance?.content?.confidence ?? question.provenance?.fields?.content?.confidence;
    if (confidence !== undefined && confidence < 0.7) flags.push({ code: 'LOW_CONFIDENCE', severity: 'WARNING', path, message: `${question.key} content confidence is ${confidence}` });
  });
  return flags;
}

export function validateDataset(dataset: ExamDataset): string[] {
  const errors: string[] = [];
  const fail = (message: string) => errors.push(`Dataset ${dataset.key}: ${message}`);
  if (!dataset.schemaVersion || dataset.schemaVersion !== 'exam-dataset/v1') fail('schemaVersion must be exam-dataset/v1');
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(dataset.key)) fail('key must be kebab-case');
  if (dataset.examTypeCode === 'HCMUS_MASTER_ENTRANCE' && dataset.orientation !== 'HCMUS') fail('HCMUS orientation is required for HCMUS datasets');
  if (dataset.examTypeCode !== 'HCMUS_MASTER_ENTRANCE' && dataset.framework !== 'VSTEP') fail('VSTEP framework is required; B1/B2 are levels, not formats');
  if (!dataset.provenanceNotes?.trim()) fail('provenanceNotes is required');
  if (dataset.sourceType === 'SYNTHETIC_MOCK' && /real exam|past exam|actual exam/i.test(`${dataset.source} ${dataset.provenanceNotes}`)) fail('synthetic content cannot claim to be a real exam');
  const sections = new Map(dataset.sections.map((section) => [section.code, section]));
  if (sections.size !== dataset.sections.length) fail('duplicate section codes');
  const keys = new Set<string>();
  const groups = new Set((dataset.groups ?? []).map((group) => group.key));
  if (groups.size !== (dataset.groups ?? []).length) fail('duplicate group keys');
  for (const question of dataset.questions) {
    const ref = question.sectionCode ?? question.partCode;
    if (keys.has(question.key)) fail(`duplicate question key ${question.key}`);
    keys.add(question.key);
    if (!ref || !sections.has(ref)) fail(`question ${question.key} references missing section/part`);
    if (!question.content?.trim()) fail(`question ${question.key} is missing English content`);
    if (!question.topicCodes.length) fail(`question ${question.key} requires a topic`);
    if (question.groupKey && !groups.has(question.groupKey)) fail(`question ${question.key} references missing group ${question.groupKey}`);
    const options = question.options ?? [];
    if (new Set(options.map((option) => option.key)).size !== options.length) fail(`question ${question.key} has duplicate option keys`);
    if (options.length > 0 && (options.length < 2 || options.filter((option) => option.isCorrect).length !== 1)) fail(`question ${question.key} must have exactly one correct option and at least two options`);
    if (options.some((option) => !option.content?.trim())) fail(`question ${question.key} has an empty option`);
    const type = question.questionTypeCode.toUpperCase();
    if (['MCQ', 'CLOZE', 'COMPREHENSION', 'LISTENING'].some((word) => type.includes(word)) && options.length === 0) fail(`question ${question.key} of type ${question.questionTypeCode} is missing answer options`);
    if (question.provenance?.hints && question.provenance.hints.kind === 'AI_ENRICHED' && (!question.hint1?.trim() || !question.provenance.hints.model)) fail(`question ${question.key} AI hints require hint1 and model provenance`);
  }
  for (const section of dataset.sections) {
    const actual = dataset.questions.filter((question) => (question.sectionCode ?? question.partCode) === section.code).length;
    if (section.questionCount !== undefined && section.questionCount !== actual) fail(`section ${section.code} expects ${section.questionCount} questions but has ${actual}`);
  }
  return errors;
}
export function assertValidDataset(dataset: ExamDataset): void { const errors = validateDataset(dataset); if (errors.length) throw new Error(errors.join('\n')); }
