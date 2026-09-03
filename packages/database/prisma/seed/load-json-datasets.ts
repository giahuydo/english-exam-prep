import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { DatasetOption, DatasetQuestion, ExamDataset } from './types';

type JsonQuestion = Omit<DatasetQuestion, 'options' | 'level' | 'difficulty' | 'explanation'> & {
  level?: DatasetQuestion['level'];
  difficulty?: DatasetQuestion['difficulty'];
  explanation?: string;
  options?: DatasetOption[];
  answer?: string;
  distractors?: string[];
};

type JsonDataset = Omit<ExamDataset, 'questions'> & { questions: JsonQuestion[] };

function normalizeQuestion(q: JsonQuestion, datasetKey: string): DatasetQuestion {
  let options = q.options ?? [];
  if (options.length === 0 && q.answer !== undefined) {
    const distractors = q.distractors ?? [];
    options = [q.answer, ...distractors].map((content, index) => ({
      key: String.fromCharCode(65 + index),
      content,
      isCorrect: index === 0,
    }));
  }
  return {
    key: q.key,
    partCode: q.partCode,
    sectionCode: q.sectionCode,
    questionTypeCode: q.questionTypeCode,
    topicCodes: q.topicCodes,
    content: q.content,
    instruction: q.instruction,
    context: q.context,
    level: q.level ?? 'B1_B2',
    difficulty: q.difficulty ?? 'MEDIUM',
    hint1: q.hint1,
    hint2: q.hint2,
    hint3: q.hint3,
    explanation: q.explanation ?? `See ${datasetKey}:${q.key} rationale.`,
    options,
  };
}

export function loadJsonDatasets(dir: string): ExamDataset[] {
  let files: string[];
  try {
    files = readdirSync(dir).filter((name) => name.endsWith('.json'));
  } catch {
    return [];
  }
  return files
    .sort()
    .map((name) => {
      const raw = readFileSync(join(dir, name), 'utf-8');
      const parsed = JSON.parse(raw) as JsonDataset;
      return { ...parsed, questions: parsed.questions.map((q) => normalizeQuestion(q, parsed.key)) };
    });
}
