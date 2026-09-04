export type ExamSectionMemory = {
  code: 'READING' | 'LISTENING' | 'WRITING' | 'SPEAKING';
  label: string;
  time: string;
  shape: string;
  sequence: string;
  mnemonic: string;
  tasks: string[];
};

/** VSTEP format facts verified for the learner-facing B1/B2 orientation. */
export const VSTEP_MEMORY_MAP: ExamSectionMemory[] = [
  { code: 'READING', label: 'Reading', time: '60 minutes', shape: '4 passages × 10 MCQ = 40', sequence: 'Passage 1 → 2 → 3 → 4', mnemonic: '4 × 10: map first, then details.', tasks: ['Detail', 'Main idea', 'Attitude', 'Inference', 'Vocabulary-in-context'] },
  { code: 'LISTENING', label: 'Listening', time: 'About 40 minutes', shape: '3 parts · 35 MCQ', sequence: 'Part 1 → 2 → 3', mnemonic: 'Three listening parts.', tasks: ['Part 1', 'Part 2', 'Part 3'] },
  { code: 'WRITING', label: 'Writing', time: '60 minutes', shape: '2 tasks', sequence: 'Email / letter → Essay', mnemonic: 'L-E: letter first, essay second.', tasks: ['Email / letter ≥120 words', 'Essay ≥250 words'] },
  { code: 'SPEAKING', label: 'Speaking', time: '12 minutes', shape: '3 parts', sequence: 'Social interaction → Solution discussion → Topic development', mnemonic: 'S-S-T: social, solve, develop.', tasks: ['Social interaction', 'Solution discussion', 'Topic development'] },
];

export const VSTEP_MEMORY_NOTE = 'Verified VSTEP format used in this app for B1/B2 preparation. Practice content is synthetic, not an official paper.';
