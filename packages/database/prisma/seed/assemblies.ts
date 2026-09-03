import type { PrismaClient } from '../../src/generated/prisma/index';

export type AssemblyDefinition = {
  key: string;
  examTypeCode: 'HCMUS_MASTER_ENTRANCE' | 'VSTEP';
  provenance: 'SYNTHETIC_MOCK' | 'RECONSTRUCTED' | 'OFFICIAL_SAMPLE' | 'REAL_EXAM';
  durationMinutes?: number;
  totalScore?: number;
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
        groupSize?: number;
        selectionPolicy?: Record<string, unknown>;
      }>;
    }>;
  }>;
};

const hcmusSections = (variant: number) => [
  { code: 'VOCABULARY_READING', title: 'Paper 1: Vocabulary / Reading', position: 1, durationMinutes: 30, score: 20, parts: [{ code: 'PAPER_1', title: 'Vocabulary / Reading', position: 1, questionCount: 20, blocks: [{ code: 'VOCABULARY', position: 1, questionTypeCode: 'VOCABULARY_MCQ', topicCodes: ['VOCABULARY'], level: 'B1_B2' as const, count: 10 }, { code: 'READING', position: 2, questionTypeCode: 'READING_COMPREHENSION', topicCodes: ['MAIN_IDEA', 'DETAIL'], level: 'B1_B2' as const, count: 10 }] }] },
  { code: 'GRAMMAR_USE_OF_ENGLISH_WRITING', title: 'Paper 2: Grammar / Use / Writing', position: 2, durationMinutes: 45, score: 40, parts: [{ code: 'PAPER_2', title: 'Grammar / Use / Writing', position: 1, questionCount: 30, blocks: [{ code: 'SENTENCE_COMPLETION', position: 1, questionTypeCode: 'SENTENCE_COMPLETION', topicCodes: ['GRAMMAR'], level: 'B1_B2' as const, count: 15 }, { code: 'CLOZE', position: 2, questionTypeCode: 'CLOZE_TEST', topicCodes: ['GRAMMAR'], level: 'B1_B2' as const, count: 10 }, { code: 'TRANSFORMATION', position: 3, questionTypeCode: 'SENTENCE_TRANSFORMATION', topicCodes: ['GRAMMAR'], level: 'B2' as const, count: 5 }] }] },
  { code: 'LISTENING', title: 'Listening', position: 3, durationMinutes: 25, score: 20, parts: [{ code: 'LISTENING', title: 'Listening', position: 1, questionCount: 20, blocks: [{ code: 'SHORT_CONVERSATION', position: 1, questionTypeCode: 'SHORT_CONVERSATION', topicCodes: ['LISTENING_DETAIL'], level: 'B1_B2' as const, count: 10 }, { code: 'LONG_CONVERSATION', position: 2, questionTypeCode: 'LONG_CONVERSATION', topicCodes: ['LISTENING_DETAIL'], level: 'B1_B2' as const, count: 5 }, { code: 'TALK', position: 3, questionTypeCode: 'TALK', topicCodes: ['LISTENING_MAIN_IDEA'], level: 'B2' as const, count: 5 }] }] },
  { code: 'SPEAKING', title: 'Speaking', position: 4, durationMinutes: 20, score: 20, parts: [{ code: 'SPEAKING', title: 'Speaking', position: 1, questionCount: 2, blocks: [{ code: 'INTRO', position: 1, questionTypeCode: 'SELF_INTRODUCTION', topicCodes: ['SOCIAL_INTERACTION'], level: 'B1' as const, count: 1 }, { code: 'GUIDED_CONVERSATION', position: 2, questionTypeCode: 'GUIDED_CONVERSATION', topicCodes: ['SOLUTION_DISCUSSION'], level: 'B1_B2' as const, count: 1 }] }] },
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
  ...[1, 2, 3].map((variant) => ({ key: `HCMUS_MASTER_MOCK_${String(variant).padStart(2, '0')}`, examTypeCode: 'HCMUS_MASTER_ENTRANCE' as const, title: `HCMUS Master Entrance Mock ${String(variant).padStart(2, '0')}`, version: '2026.1.0', source: 'Synthetic mock; structure informed by project source, not an official exam paper', provenance: 'SYNTHETIC_MOCK' as const, durationMinutes: 120, totalScore: 100, status: 'DRAFT' as const, sections: hcmusSections(variant) })),
  ...[1, 2].map((variant) => ({ key: `VSTEP_3_5_MOCK_${String(variant).padStart(2, '0')}`, examTypeCode: 'VSTEP' as const, title: `VSTEP 3-5 Mock ${String(variant).padStart(2, '0')}`, version: '1.0.0', source: 'Synthetic mock aligned to VSTEP 3-5 format; not an official exam paper', provenance: 'SYNTHETIC_MOCK' as const, durationMinutes: 172, totalScore: 100, status: 'ACTIVE' as const, sections: vstepSections })),
];

export function validateAssembly(assembly: AssemblyDefinition): void {
  if (!assembly.key || !assembly.version) throw new Error('Assembly key and version are required');
  const sectionPositions = new Set<number>();
  let sectionScore = 0;
  for (const section of assembly.sections) {
    if (sectionPositions.has(section.position)) throw new Error(`${assembly.key}: duplicate section position ${section.position}`);
    sectionPositions.add(section.position);
    sectionScore += section.score ?? 0;
    for (const part of section.parts) {
      const slotCount = part.blocks.reduce((sum, block) => sum + block.count, 0);
      if (slotCount !== part.questionCount) throw new Error(`${assembly.key}/${part.code}: slot count ${slotCount} does not equal part count ${part.questionCount}`);
      if (part.groupCount && part.questionsPerGroup && part.groupCount * part.questionsPerGroup !== part.questionCount) throw new Error(`${assembly.key}/${part.code}: grouping does not equal question count`);
    }
  }
  if (assembly.totalScore !== undefined && sectionScore !== assembly.totalScore) throw new Error(`${assembly.key}: section scores do not equal total score`);
}

export async function seedAssembly(prisma: PrismaClient, assembly: AssemblyDefinition) {
  validateAssembly(assembly);
  const examType = await prisma.examType.findUniqueOrThrow({ where: { code: assembly.examTypeCode } });
  const blueprint = await prisma.examBlueprint.upsert({
    where: { externalKey: `assembly:${assembly.key}` },
    update: { examTypeId: examType.id, name: assembly.title, version: assembly.version, source: assembly.source, provenance: assembly.provenance, durationMinutes: assembly.durationMinutes, totalScore: assembly.totalScore, status: assembly.status },
    create: { externalKey: `assembly:${assembly.key}`, examTypeId: examType.id, name: assembly.title, version: assembly.version, source: assembly.source, provenance: assembly.provenance, durationMinutes: assembly.durationMinutes, totalScore: assembly.totalScore, status: assembly.status },
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
