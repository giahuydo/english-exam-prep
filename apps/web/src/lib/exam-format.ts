export type ExamSectionMemory = {
  code: 'READING' | 'LISTENING' | 'WRITING' | 'SPEAKING';
  label: string;
  time: string;
  shape: string;
  mnemonic: string;
  tasks: string[];
};

export const VSTEP_MEMORY_MAP: ExamSectionMemory[] = [
  { code: 'READING', label: 'Reading', time: '60 minutes', shape: '4 passages × 10 MCQ', mnemonic: '4 × 10: map first, details next.', tasks: ['Main idea', 'Detail', 'Inference', 'Reference'] },
  { code: 'LISTENING', label: 'Listening', time: 'Time is not specified here', shape: '3 parts · 35 MCQ', mnemonic: 'Three listens: parts 1, 2, 3.', tasks: ['Part 1', 'Part 2', 'Part 3'] },
  { code: 'WRITING', label: 'Writing', time: '60 minutes', shape: '2 tasks', mnemonic: 'L-E: letter first, essay second.', tasks: ['Email / letter ≥120 words', 'Essay ≥250 words'] },
  { code: 'SPEAKING', label: 'Speaking', time: '3 parts', shape: '3 parts', mnemonic: 'Three speaking parts.', tasks: ['Part 1', 'Part 2', 'Part 3'] },
];

export const VSTEP_MEMORY_NOTE = 'Verified VSTEP structure used in this app. Practice content is synthetic, not an official paper.';
