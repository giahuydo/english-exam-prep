import type { PrismaClient } from '../../src/generated/prisma';
import type { ExamDataset, SeedDb } from './types';
import { stableId } from './core';

export async function importDataset(prisma: SeedDb, dataset: ExamDataset): Promise<{ exams: number; questions: number; options: number }> {
  const examType = await prisma.examType.findUniqueOrThrow({ where: { code: dataset.examTypeCode } });
  const examId = stableId(`dataset:exam:${dataset.key}`);
  const exam = await prisma.exam.upsert({
    where: { id: examId },
    update: { externalKey: `dataset:${dataset.key}`, datasetKey: dataset.key, examTypeId: examType.id, title: dataset.title, source: dataset.source, detectedLevel: dataset.detectedLevel, status: 'REVIEWED' },
    create: { id: examId, externalKey: `dataset:${dataset.key}`, datasetKey: dataset.key, examTypeId: examType.id, title: dataset.title, source: dataset.source, detectedLevel: dataset.detectedLevel, status: 'REVIEWED' },
  });

  for (const section of dataset.sections) {
    await prisma.examSection.upsert({
      where: { examId_code: { examId: exam.id, code: section.code } },
      update: section,
      create: { ...section, examId: exam.id },
    });
  }

  const topics = new Map((await prisma.topic.findMany({ where: { code: { in: [...new Set(dataset.questions.flatMap((q) => q.topicCodes))] } }, select: { id: true, code: true } })).map((row) => [row.code, row.id]));
  const questionTypes = new Map((await prisma.questionType.findMany({ where: { code: { in: [...new Set(dataset.questions.map((q) => q.questionTypeCode))] } }, select: { id: true, code: true } })).map((row) => [row.code, row.id]));
  let optionCount = 0;

  for (const question of dataset.questions) {
    const questionTypeId = questionTypes.get(question.questionTypeCode);
    if (!questionTypeId) throw new Error(`Dataset ${dataset.key}: missing question type ${question.questionTypeCode}`);
    const sectionCode = question.sectionCode ?? dataset.sections.find((item) => item.code === question.partCode)?.code;
    if (!sectionCode) throw new Error(`Dataset ${dataset.key}: question ${question.key} has no sectionCode`);
    const section = await prisma.examSection.findUniqueOrThrow({ where: { examId_code: { examId: exam.id, code: sectionCode } } });
    const questionId = stableId(`dataset:question:${dataset.key}:${question.key}`);
    await prisma.question.upsert({
      where: { id: questionId },
      update: {
        examId: exam.id, examSectionId: section.id, questionTypeId, datasetKey: `${dataset.key}:${question.key}`, origin: 'MANUAL', contentRole: 'MOCK_EXAM', content: question.content,
        instruction: question.instruction, context: question.context, level: question.level, difficulty: question.difficulty ?? 'MEDIUM',
        hint1: question.hint1, hint2: question.hint2, hint3: question.hint3, explanation: question.explanation, status: 'PUBLISHED',
      },
      create: {
        id: questionId, examId: exam.id, examSectionId: section.id, questionTypeId, datasetKey: `${dataset.key}:${question.key}`, origin: 'MANUAL', contentRole: 'MOCK_EXAM', content: question.content,
        instruction: question.instruction, context: question.context, level: question.level, difficulty: question.difficulty ?? 'MEDIUM',
        hint1: question.hint1, hint2: question.hint2, hint3: question.hint3, explanation: question.explanation, status: 'PUBLISHED',
      },
    });
    await prisma.questionTopic.deleteMany({ where: { questionId } });
    for (const [index, code] of question.topicCodes.entries()) {
      const topicId = topics.get(code);
      if (!topicId) throw new Error(`Dataset ${dataset.key}: missing topic ${code}`);
      await prisma.questionTopic.create({ data: { questionId, topicId, isPrimary: index === 0, source: 'SYSTEM', confidence: 1 } });
    }
    for (const [position, option] of question.options.entries()) {
      await prisma.questionOption.upsert({
        where: { questionId_optionKey: { questionId, optionKey: option.key } },
        update: { content: option.content, isCorrect: option.isCorrect, explanation: option.explanation, position },
        create: { id: stableId(`dataset:option:${dataset.key}:${question.key}:${option.key}`), questionId, optionKey: option.key, content: option.content, isCorrect: option.isCorrect, explanation: option.explanation, position },
      });
      optionCount += 1;
    }
  }
  return { exams: 1, questions: dataset.questions.length, options: optionCount };
}

export async function importDatasets(prisma: PrismaClient, datasets: ExamDataset[]) {
  const totals = { exams: 0, questions: 0, options: 0 };
  for (const dataset of datasets) {
    const result = await importDataset(prisma, dataset);
    totals.exams += result.exams;
    totals.questions += result.questions;
    totals.options += result.options;
    console.log(`Seeded ${dataset.key}: ${result.questions} questions / ${result.options} options`);
  }
  return totals;
}
