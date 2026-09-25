import { sourceQuestions, type BackendQuestion } from './source-questions';
import { withVietnamese } from './translations';

export type BackendTopic = {
  id: number;
  title: string;
  questions: BackendQuestion[];
};

const titles = [
  'Introduction & Experience',
  'API & Backend Design',
  'Database',
  'Queue & Messaging',
  'Caching & Redis',
  'Performance & Scaling',
  'Reliability & Production Issues',
  'Concurrency & Data Consistency',
  'Security',
  'System Design',
  'Docker / Cloud / DevOps',
  'Testing & Code Quality',
] as const;

export const backendTopics: BackendTopic[] = titles.map((title, index) => ({
  id: index + 1,
  title,
  questions: withVietnamese(index + 1, sourceQuestions[index + 1] ?? []),
}));

export const recommendedPath = [1, 3, 4, 6, 7, 8, 10] as const;
