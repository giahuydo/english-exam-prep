import type { BlueprintPart, BlueprintSection, PrismaClient } from '../../src/generated/prisma/index';
import type { ExamDataset, SeedDb } from './types';

export type AssemblyDefinition = {
  key: string;
  examTypeCode: 'HCMUS_MASTER_ENTRANCE' | 'VSTEP';
  title: string;
  version: string;
  source: string;
  status: 'DRAFT' | 'ACTIVE';
  sections: Array<{
    code: string;
    title: string;
    position: number;
    instructions?: string;
    durationMinutes?: number;
    score?: number;
    parts: Array<{
      code: string;
      title: string;
      position: number;
      instructions?: string;
      durationMinutes?: number;
      score?: number;
      questionCount: number;
      groupCount?: number;
      questionsPerGroup?: number;
      groupingSemantics?: string;
      blocks: Array<{
        code: string;
        position: number;
        questionTypeCode: string;
        topicCodes?: string[];
        level?: 'B1' | 'B2' | 'C1' | 'B1_B2' | 'B1_C1';
        difficulty?: 'EASY' | 'MEDIUM' | 'HARD';
        count: number;
        groupCount?: number;
        questionsPerGroup?: number;
        groupingSemantics?: string;
        sharedStimulus?: string;
        selectionPolicy?: Record<string, unknown>;
      }>;
    }>;
  }>;
};

const hcmusSections = (variant: number) => [
  { code: 'VOCABULARY_READING', title: 'Vocabulary & Reading', position: 1, durationMinutes: 45, score: 25, parts: [{ code: 'VOCABULARY_READING', title: `Vocabulary & Reading — Mock ${variant}`, position: 1, questionCount: 40, blocks: [{ code: 'VOCAB', position: 1, questionTypeCode: 'VOCABULARY_MCQ', topicCodes: ['VOCABULARY'], level: 'B1_B2' as const, count: 20 }, { code: 'READING', position: 2, questionTypeCode: 'READING_COMPREHENSION', topicCodes: ['MAIN_IDEA'], level: 'B1_B2' as const, count: 20 }] }] },
  { code: 'GRAMMAR_USE_OF_ENGLISH', title: 'Grammar & Use of English', position: 2, durationMinutes: 35, score: 25, parts: [{ code: 'GRAMMAR_USE_OF_ENGLISH', title: 'Grammar & Use of English', position: 1, questionCount: 30, blocks: [{ code: 'GRAMMAR', position: 1, questionTypeCode: 'MCQ_SINGLE_BLANK', topicCodes: ['TENSES'], level: 'B2' as const, count: 30 }] }] },
  { code: 'LISTENING', title: 'Listening', position: 3, durationMinutes: 30, score: 25, parts: [{ code: 'LISTENING', title: 'Listening', position: 1, questionCount: 30, blocks: [{ code: 'LISTENING', position: 1, questionTypeCode: 'LISTENING_MCQ', topicCodes: ['LISTENING'], level: 'B1_B2' as const, count: 30 }] }] },
  { code: 'SPEAKING', title: 'Speaking', position: 4, durationMinutes: 12, score: 25, parts: [{ code: 'SPEAKING', title: 'Speaking', position: 1, questionCount: 2, blocks: [{ code: 'SPEAKING', position: 1, questionTypeCode: 'TOPIC_DEVELOPMENT', topicCodes: ['TOPIC_DEVELOPMENT'], level: 'B1_B2' as const, count: 2 }] }] },
];

const vstepSections = [
  { code: 'LISTENING', title: 'Listening', position: 1, durationMinutes: 40, score: 25, parts: [
    { code: 'LISTENING_P1', title: 'Part 1: Announcements and Instructions', position: 1, questionCount: 8, groupCount: 8, questionsPerGroup: 1, groupingSemantics: '8 independent announcements/instructions', blocks: [{ code: 'ANNOUNCEMENTS', position: 1, questionTypeCode: 'ANNOUNCEMENT_INSTRUCTION', topicCodes: ['LISTENING_DETAIL'], level: 'B1' as const, count: 8, groupCount: 8, questionsPerGroup: 1 }] },
    { code: 'LISTENING_P2', title: 'Part 2: Conversations', position: 2, questionCount: 12, groupCount: 3, questionsPerGroup: 4, groupingSemantics: '3 conversations x 4 questions', blocks: [{ code: 'CONVERSATIONS', position: 1, questionTypeCode: 'CONVERSATION', topicCodes: ['LISTENING_DETAIL'], level: 'B1_B2' as const, count: 12, groupCount: 3, questionsPerGroup: 4 }] },
    { code: 'LISTENING_P3', title: 'Part 3: Talks / Lectures', position: 3, questionCount: 15, groupCount: 3, questionsPerGroup: 5, groupingSemantics: '3 talks x 5 questions', blocks: [{ code: 'TALKS', position: 1, questionTypeCode: 'TALK_LECTURE', topicCodes: ['LISTENING_MAIN_IDEA'], level: 'B2' as const, count: 15, groupCount: 3, questionsPerGroup: 5 }] },
  ] },
  { code: 'READING', title: 'Reading', position: 2, durationMinutes: 60, score: 25, parts: [{ code: 'READING', title: 'Reading: Four Passages', position: 1, questionCount: 40, groupCount: 4, questionsPerGroup: 10, groupingSemantics: '4 passages x 10 questions', blocks: [{ code: 'PASSAGES', position: 1, questionTypeCode: 'READING_COMPREHENSION', topicCodes: ['MAIN_IDEA', 'DETAIL'], level: 'B1_C1' as const, count: 40, groupCount: 4, questionsPerGroup: 10, sharedStimulus: 'passage', selectionPolicy: { mode: 'round_robin_groups' } }] }] },
  { code: 'WRITING', title: 'Writing', position: 3, durationMinutes: 60, score: 25, parts: [{ code: 'WRITING_TASKS', title: 'Writing: Two Tasks', position: 1, questionCount: 2, groupCount: 2, questionsPerGroup: 1, groupingSemantics: '2 writing tasks', blocks: [{ code: 'TASKS', position: 1, questionTypeCode: 'LETTER_EMAIL', topicCodes: ['LETTER_EMAIL'], level: 'B1' as const, count: 2 }] }] },
  { code: 'SPEAKING', title: 'Speaking', position: 4, durationMinutes: 12, score: 25, parts: [{ code: 'SPEAKING_PARTS', title: 'Speaking: Three Parts', position: 1, questionCount: 3, groupCount: 3, questionsPerGroup: 1, groupingSemantics: '3 speaking parts', blocks: [{ code: 'PARTS', position: 1, questionTypeCode: 'TOPIC_DEVELOPMENT', topicCodes: ['TOPIC_DEVELOPMENT'], level: 'B1_B2' as const, count: 3 }] }] },
];

export const assemblies: AssemblyDefinition[] = [
  ...[1, 2, 3].map((variant) => ({ key: `HCMUS_MASTER_MOCK_${String(variant).padStart(2, '0')}`, examTypeCode: 'HCMUS_MASTER_ENTRANCE' as const, title: `HCMUS Master Entrance Mock ${String(variant).padStart(2, '0')}`, version: '1.0.0', source: 'Synthetic MVP mock assembly; not an official exam paper', status: 'DRAFT' as const, sections: hcmusSections(variant) })),
  ...[1, 2].map((variant) => ({ key: `VSTEP_3_5_MOCK_${String(variant).padStart(2, '0')}`, examTypeCode: 'VSTEP' as const, title: `VSTEP 3-5 Mock ${String(variant).padStart(2, '0')}`, version: '1.0.0', source: 'Synthetic MVP mock aligned to VSTEP 3-5 format; not an official exam paper', status: 'ACTIVE' as const, sections: vstepSections })),
];

export async function seedAssembly(prisma: PrismaClient, assembly: AssemblyDefinition) {
  const examType = await prisma.examType.findUniqueOrThrow({ where: { code: assembly.examTypeCode } });
  const blueprint = await prisma.examBlueprint.upsert({
    where: { externalKey: `assembly:${assembly.key}` },
    update: { examTypeId: examType.id, name: assembly.title, version: assembly.version, status: assembly.status },
    create: { externalKey: `assembly:${assembly.key}`, examTypeId: examType.id, name: assembly.title, version: assembly.version, status: assembly.status },
  });

  for (const sectionDef of assembly.sections) {
    const section = await prisma.blueprintSection.upsert({
      where: { blueprintId_code: { blueprintId: blueprint.id, code: sectionDef.code } },
      update: {
        title: sectionDef.title,
        position: sectionDef.position,
        instructions: sectionDef.instructions,
        durationMinutes: sectionDef.durationMinutes,
        score: sectionDef.score,
      },
      create: {
        blueprintId: blueprint.id,
        code: sectionDef.code,
        title: sectionDef.title,
        position: sectionDef.position,
        instructions: sectionDef.instructions,
        durationMinutes: sectionDef.durationMinutes,
        score: sectionDef.score,
      },
    });

    for (const partDef of sectionDef.parts) {
      const part = await prisma.blueprintPart.upsert({
        where: { sectionId_code: { sectionId: section.id, code: partDef.code } },
        update: {
          title: partDef.title,
          position: partDef.position,
          instructions: partDef.instructions,
          durationMinutes: partDef.durationMinutes,
          score: partDef.score,
          questionCount: partDef.questionCount,
          groupCount: partDef.groupCount,
          questionsPerGroup: partDef.questionsPerGroup,
          groupingSemantics: partDef.groupingSemantics,
        },
        create: {
          externalKey: `assembly:${assembly.key}:part:${partDef.code}`,
          sectionId: section.id,
          code: partDef.code,
          title: partDef.title,
          position: partDef.position,
          instructions: partDef.instructions,
          durationMinutes: partDef.durationMinutes,
          score: partDef.score,
          questionCount: partDef.questionCount,
          groupCount: partDef.groupCount,
          questionsPerGroup: partDef.questionsPerGroup,
          groupingSemantics: partDef.groupingSemantics,
        },
      });

      for (const block of partDef.blocks) {
        const questionType = await prisma.questionType.findUniqueOrThrow({ where: { code: block.questionTypeCode } });
        const topic = block.topicCodes?.[0]
          ? await prisma.topic.findUniqueOrThrow({ where: { code: block.topicCodes[0] } })
          : null;
        const slotData = {
          questionTypeId: questionType.id,
          topicId: topic?.id,
          position: block.position,
          count: block.count,
          level: block.level,
          difficulty: block.difficulty,
          groupCount: block.groupCount,
          questionsPerGroup: block.questionsPerGroup,
          groupingSemantics: block.groupingSemantics,
          sharedStimulus: block.sharedStimulus,
          groupSize: block.groupSize,
          selectionPolicy: block.selectionPolicy,
        };
        await prisma.blueprintSlot.upsert({
          where: { partId_code: { partId: part.id, code: block.code } },
          update: slotData,
          create: {
            externalKey: `assembly:${assembly.key}:part:${partDef.code}:block:${block.code}`,
            partId: part.id,
            code: block.code,
            title: block.code,
            ...slotData,
          },
        });
      }
    }
  }
}
