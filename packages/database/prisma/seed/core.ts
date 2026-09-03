import bcrypt from 'bcryptjs';
import { createHash } from 'node:crypto';
import type { PrismaClient } from '../../src/generated/prisma/index';

export function stableId(key: string): string {
  const hex = createHash('sha256').update(key).digest('hex').slice(0, 32);
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-4${hex.slice(13, 16)}-${((parseInt(hex.slice(16, 18), 16) & 0x3f) | 0x80).toString(16).padStart(2, '0')}${hex.slice(18, 20)}-${hex.slice(20)}`;
}

const topicSeeds = [
  ['GRAMMAR', 'Grammar', 'GRAMMAR'], ['PRESENT_PERFECT', 'Present Perfect', 'GRAMMAR'], ['VOCABULARY', 'Vocabulary', 'VOCABULARY'], ['READING', 'Reading Skills', 'READING'], ['LISTENING', 'Listening Skills', 'LISTENING'], ['WRITING', 'Writing Skills', 'WRITING'], ['SPEAKING', 'Speaking Skills', 'SPEAKING'],
  ['TENSES', 'Tenses', 'GRAMMAR'], ['CONDITIONALS', 'Conditionals', 'GRAMMAR'], ['PASSIVE_VOICE', 'Passive Voice', 'GRAMMAR'], ['WORD_FORM', 'Word Form', 'VOCABULARY'], ['PREPOSITIONS', 'Prepositions', 'VOCABULARY'], ['COLLOCATION', 'Collocation', 'VOCABULARY'],
  ['MAIN_IDEA', 'Main Idea', 'READING'], ['DETAIL', 'Detail', 'READING'], ['INFERENCE', 'Inference', 'READING'], ['REFERENCE', 'Reference', 'READING'], ['VOCABULARY_IN_CONTEXT', 'Vocabulary in Context', 'READING'], ['AUTHOR_PURPOSE', 'Author Purpose', 'READING'],
  ['LISTENING_MAIN_IDEA', 'Listening Main Idea', 'LISTENING'], ['LISTENING_DETAIL', 'Listening Detail', 'LISTENING'], ['DETAIL_INFORMATION', 'Listening Detail Information', 'LISTENING'], ['LISTENING_INFERENCE', 'Listening Inference', 'LISTENING'], ['SPEAKER_INTENT_OR_PURPOSE', 'Speaker Intent or Purpose', 'LISTENING'],
  ['LETTER_EMAIL', 'Letter / Email', 'WRITING'], ['AGREE_DISAGREE', 'Agree / Disagree', 'WRITING'], ['DISCUSS_BOTH_SIDES', 'Discuss Both Sides', 'WRITING'], ['PROBLEM_SOLUTION', 'Problem / Solution', 'WRITING'],
  ['HOMETOWN', 'Hometown', 'SPEAKING'], ['HOLIDAYS', 'Holidays', 'SPEAKING'], ['JOB', 'Job', 'SPEAKING'], ['TRANSPORT', 'Transport', 'SPEAKING'], ['TOPIC_DEVELOPMENT', 'Topic Development', 'SPEAKING'],
  ['WISH', 'Wish / If only', 'GRAMMAR'], ['VOCAB_IN_CONTEXT', 'Vocabulary in Context', 'READING'], ['RELATIVE_CLAUSES', 'Relative Clauses', 'GRAMMAR'], ['REPORTED_SPEECH', 'Reported Speech', 'GRAMMAR'], ['MODAL_VERBS', 'Modal Verbs', 'GRAMMAR'], ['GERUND_INFINITIVE', 'Gerund / Infinitive', 'GRAMMAR'], ['COMPARISON', 'Comparison', 'GRAMMAR'], ['ARTICLES', 'Articles', 'GRAMMAR'], ['SUBJECT_VERB_AGREEMENT', 'Subject-Verb Agreement', 'GRAMMAR'], ['CONJUNCTIONS', 'Conjunctions', 'GRAMMAR'], ['ERROR_RECOGNITION', 'Error Recognition', 'GRAMMAR'], ['CLOZE', 'Cloze', 'GRAMMAR'], ['TRANSFORMATION', 'Sentence Transformation', 'GRAMMAR'],

  ['PHRASAL_VERBS', 'Phrasal Verbs', 'VOCABULARY'], ['SYNONYM', 'Synonym', 'VOCABULARY'], ['ANTONYM', 'Antonym', 'VOCABULARY'], ['IDIOMS', 'Idioms', 'VOCABULARY'],
  ['VOCAB_IN_CONTEXT_VOCAB', 'Vocabulary in Context (Vocabulary)', 'VOCABULARY'], ['SENTENCE_INSERTION', 'Sentence Insertion', 'READING'], ['SENTENCE_MEANING', 'Sentence Meaning', 'READING'], ['READING_MAIN_IDEA', 'Main Idea (Reading)', 'READING'], ['DETAIL_INFORMATION_READING', 'Detail Information (Reading)', 'READING'],
  ['ATTITUDE_OR_OPINION', 'Attitude or Opinion', 'LISTENING'], ['NEWS_NEWSPAPERS', 'News / Newspapers', 'SPEAKING'], ['SOUND_NOISE', 'Sound / Noise', 'SPEAKING'],
] as const;

const questionTypeSeeds = [
  ['MCQ_SINGLE_BLANK', 'MCQ Single Blank', 'GRAMMAR'], ['ERROR_RECOGNITION', 'Error Recognition', 'GRAMMAR'], ['VOCABULARY_IN_CONTEXT', 'Vocabulary in Context', 'VOCABULARY'], ['VOCABULARY_MCQ', 'Vocabulary MCQ', 'VOCABULARY'], ['READING_COMPREHENSION', 'Reading Comprehension', 'READING'],
  ['LISTENING_MCQ', 'Listening MCQ', 'LISTENING'], ['ANNOUNCEMENT_INSTRUCTION', 'Announcement / Instruction', 'LISTENING'], ['CONVERSATION', 'Conversation', 'LISTENING'], ['TALK_LECTURE', 'Talk / Lecture', 'LISTENING'],
  ['LETTER_EMAIL', 'Letter / Email', 'WRITING'], ['ESSAY', 'Essay', 'WRITING'], ['SOCIAL_INTERACTION', 'Social Interaction', 'SPEAKING'], ['SOLUTION_DISCUSSION', 'Solution Discussion', 'SPEAKING'], ['TOPIC_DEVELOPMENT', 'Topic Development', 'SPEAKING'], ['SENTENCE_COMPLETION', 'Sentence Completion', 'GRAMMAR'], ['CLOZE_TEST', 'Cloze Test', 'GRAMMAR'], ['SENTENCE_TRANSFORMATION', 'Sentence Transformation', 'GRAMMAR'], ['VOCABULARY', 'Vocabulary (General)', 'VOCABULARY'], ['READING_MAIN_IDEA', 'Reading - Main Idea', 'READING'], ['READING_DETAIL', 'Reading - Detail', 'READING'], ['READING_INFERENCE', 'Reading - Inference', 'READING'], ['SHORT_CONVERSATION', 'Listening - Short Conversation', 'LISTENING'], ['LONG_CONVERSATION', 'Listening - Long Conversation', 'LISTENING'], ['TALK', 'Listening - Talk / Monologue', 'LISTENING'], ['SELF_INTRODUCTION', 'Speaking - Self Introduction', 'SPEAKING'], ['GUIDED_CONVERSATION', 'Speaking - Guided Conversation', 'SPEAKING'], ['SPEAKING', 'Speaking (General)', 'SPEAKING'],
] as const;

export async function seedCore(prisma: PrismaClient) {
  const examTypes = [
    { code: 'HCMUS_MASTER_ENTRANCE', name: 'HCMUS Master Entrance', description: 'HCMUS graduate school English entrance exam (B1-B2 band)', levelFrom: 'B1' as const, levelTo: 'B2' as const },
    { code: 'B1', name: 'B1 (CEFR)', description: 'CEFR B1 general English target', levelFrom: 'B1' as const, levelTo: 'B1' as const },
    { code: 'B2', name: 'B2 (CEFR)', description: 'CEFR B2 general English target', levelFrom: 'B2' as const, levelTo: 'B2' as const },
    { code: 'VSTEP', name: 'VSTEP 3-5', description: 'Vietnamese Standardized Test of English Proficiency format (B1-C1)', levelFrom: 'B1' as const, levelTo: 'C1' as const },
    { code: 'CUSTOM', name: 'Custom', description: 'Custom exam pattern', levelFrom: null, levelTo: null },
  ];
  for (const examType of examTypes) await prisma.examType.upsert({ where: { code: examType.code }, update: examType, create: examType });
  await prisma.examType.deleteMany({ where: { code: 'VSTEP_3_5' } });
  for (const [code, name, category] of topicSeeds) await prisma.topic.upsert({ where: { code }, update: { name, category }, create: { code, name, category } });
  for (const [code, name, category] of questionTypeSeeds) await prisma.questionType.upsert({ where: { code }, update: { name, category }, create: { code, name, category } });
  const grammar = await prisma.topic.findUniqueOrThrow({ where: { code: 'GRAMMAR' } });
  const scopes = [
    { code: 'TENSES', name: 'Tenses', topicCode: 'TENSES', position: 1, lesson: { rule: 'Choose tense by time and aspect.', examples: ['I have finished my work.', 'She had left before noon.'], commonMistakes: ['Confusing present perfect with past simple.'] } },
    { code: 'TENSES_PRESENT_PERFECT', name: 'Present Perfect', topicCode: 'TENSES', position: 2, lesson: { rule: 'have/has + past participle for past actions connected to now.', examples: ['They have lived here since 2020.'], commonMistakes: ['Do not use a finished past time with present perfect.'] } },
    { code: 'TENSES_PAST_PERFECT', name: 'Past Perfect', topicCode: 'TENSES', position: 3, lesson: { rule: 'had + past participle for the earlier of two past events.', examples: ['We had eaten before they arrived.'], commonMistakes: ['Do not use it when there is no earlier past reference.'] } },
    { code: 'CONDITIONALS', name: 'Conditionals', topicCode: 'CONDITIONALS', position: 9, lesson: { rule: 'Use conditional forms to connect a condition with its result.', examples: ['If it rains, we will stay home.'], commonMistakes: ['Mixing the condition and result time meanings.'] } },
    ...['1', '2', '3', 'MIXED'].map((kind, index) => ({ code: `CONDITIONAL_TYPE_${kind}`, name: `Conditional Type ${kind}`, topicCode: 'CONDITIONALS', position: 10 + index, lesson: { rule: `${kind} conditional: match the condition and result time meaning.`, examples: ['If it rains, we will stay home.'], commonMistakes: ['Avoid will in the if-clause for standard first conditionals.'] } })),
  ];
  for (const scope of scopes) {
    const topic = await prisma.topic.findUniqueOrThrow({ where: { code: scope.topicCode } });
    const tenseParent = scope.code.startsWith('TENSES_') ? (await prisma.learningScope.findUnique({ where: { code: 'TENSES' } }))?.id : undefined;
    const conditionalParent = scope.code.startsWith('CONDITIONAL_TYPE_') ? (await prisma.learningScope.findUnique({ where: { code: 'CONDITIONALS' } }))?.id : undefined;
    await prisma.learningScope.upsert({ where: { code: scope.code }, update: { name: scope.name, topicId: topic.id, parentId: tenseParent ?? conditionalParent, position: scope.position, lesson: scope.lesson }, create: { code: scope.code, name: scope.name, topicId: topic.id, parentId: tenseParent ?? conditionalParent, position: scope.position, lesson: scope.lesson } });
  }
  const email = process.env.SEED_ADMIN_EMAIL ?? 'admin@example.com';
  return prisma.user.upsert({ where: { email }, update: { role: 'ADMIN', status: 'ACTIVE' }, create: { email, passwordHash: await bcrypt.hash(process.env.SEED_ADMIN_PASSWORD ?? 'admin123!', 10), name: 'Admin', role: 'ADMIN', status: 'ACTIVE' } });
}
