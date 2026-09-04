import type { PrismaClient } from '../../src/generated/prisma';
import type { ExamDataset, SeedDb } from './types';
import { assertValidDataset } from './types';
import { stableId } from './core';

export async function importDataset(prisma: SeedDb, dataset: ExamDataset): Promise<{ exams: number; questions: number; options: number }> {
  assertValidDataset(dataset);
  const examType = await prisma.examType.findUniqueOrThrow({ where: { code: dataset.examTypeCode } });
  const examId = stableId(`dataset:exam:${dataset.key}`);
  const examData = { externalKey: `dataset:${dataset.key}`, datasetKey: dataset.key, examTypeId: examType.id, examFileId: dataset.sourceDocument?.fileId, title: dataset.title, source: dataset.source, detectedLevel: dataset.detectedLevel, sourceType: dataset.sourceType, sourceYear: dataset.sourceYear, sourceCenter: dataset.sourceCenter, sourceOrg: dataset.sourceOrg, sourceReference: dataset.sourceReference ?? dataset.sourceUrl, provenanceNotes: dataset.provenanceNotes, status: 'REVIEWED' as const };
  const exam = await prisma.exam.upsert({ where: { id: examId }, update: examData, create: { id: examId, ...examData } });
  for (const section of dataset.sections) await prisma.examSection.upsert({ where: { examId_code: { examId: exam.id, code: section.code } }, update: section, create: { ...section, examId: exam.id } });
  const topics = new Map((await prisma.topic.findMany({ where: { code: { in: [...new Set(dataset.questions.flatMap((q) => q.topicCodes))] } }, select: { id: true, code: true } } )).map((row: { code: string; id: string }) => [row.code, row.id]));
  const questionTypes = new Map((await prisma.questionType.findMany({ where: { code: { in: [...new Set(dataset.questions.map((q) => q.questionTypeCode))] } }, select: { id: true, code: true } } )).map((row: { code: string; id: string }) => [row.code, row.id]));
  const groups = new Map<string, string>();
  for (const [position, group] of (dataset.groups ?? []).entries()) { const { key, kind, stimulus, ...groupData } = group; const row = await prisma.questionGroup.upsert({ where: { externalKey: `dataset:${dataset.key}:${key}` }, update: { ...groupData, code: key, position, stimulus: stimulus ?? null }, create: { id: stableId(`dataset:group:${dataset.key}:${key}`), externalKey: `dataset:${dataset.key}:${key}`, examId: exam.id, code: key, position, stimulus: stimulus ?? null, ...groupData } }); groups.set(key, row.id); }
  let optionCount = 0;
  for (const question of dataset.questions) {
    const questionTypeId = questionTypes.get(question.questionTypeCode);
    if (!questionTypeId) throw new Error(`Dataset ${dataset.key}: missing question type ${question.questionTypeCode}`);
    const section = await prisma.examSection.findUniqueOrThrow({ where: { examId_code: { examId: exam.id, code: question.sectionCode ?? question.partCode! } } });
    const questionId = stableId(`dataset:question:${dataset.key}:${question.key}`);
    const questionData = { examId: exam.id, examSectionId: section.id, questionGroupId: question.groupKey ? groups.get(question.groupKey) : undefined, questionTypeId, datasetKey: `${dataset.key}:${question.key}`, origin: question.sourceType === 'AI_GENERATED' ? 'AI_GENERATED' as const : 'MANUAL' as const, contentRole: 'MOCK_EXAM' as const, content: question.content, instruction: question.instruction, context: question.context, level: question.level, difficulty: question.difficulty ?? 'MEDIUM', hint1: question.hint1, hint2: question.hint2, hint3: question.hint3, explanation: question.explanation, sourceType: question.sourceType ?? dataset.sourceType, sourceYear: question.sourceYear ?? dataset.sourceYear, sourceCenter: question.sourceCenter ?? dataset.sourceCenter, sourceOrg: question.sourceOrg ?? dataset.sourceOrg, sourceReference: question.sourceReference ?? dataset.sourceReference ?? dataset.sourceUrl, provenanceNotes: question.provenanceNotes ?? dataset.provenanceNotes, aiGenerationMetadata: question.provenance ? { provenance: question.provenance } : undefined, status: 'PUBLISHED' as const };
    await prisma.question.upsert({ where: { id: questionId }, update: questionData, create: { id: questionId, ...questionData } });
    for (const [index, code] of question.topicCodes.entries()) { const topicId = topics.get(code); if (!topicId) throw new Error(`Dataset ${dataset.key}: missing topic ${code}`); await prisma.questionTopic.upsert({ where: { questionId_topicId: { questionId, topicId } }, update: { isPrimary: index === 0, source: 'SYSTEM', confidence: 1 }, create: { questionId, topicId, isPrimary: index === 0, source: 'SYSTEM', confidence: 1 } }); }
    for (const [position, option] of (question.options ?? []).entries()) { await prisma.questionOption.upsert({ where: { questionId_optionKey: { questionId, optionKey: option.key } }, update: { content: option.content, isCorrect: option.isCorrect, explanation: option.explanation, position }, create: { id: stableId(`dataset:option:${dataset.key}:${question.key}:${option.key}`), questionId, optionKey: option.key, content: option.content, isCorrect: option.isCorrect, explanation: option.explanation, position } }); optionCount += 1; }
  }
  return { exams: 1, questions: dataset.questions.length, options: optionCount };
}
export async function importDatasets(prisma: PrismaClient, datasets: ExamDataset[]) { const totals = { exams: 0, questions: 0, options: 0 }; for (const dataset of datasets) { const result = await importDataset(prisma, dataset); totals.exams += result.exams; totals.questions += result.questions; totals.options += result.options; } return totals; }
