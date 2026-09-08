'use client';

import { useCallback, useEffect, useState } from 'react';

const KEY = 'ee.interview.progress.v2';
export type ReviewDifficulty = 'again' | 'hard' | 'good' | 'easy';
export type LearningLevel = 1 | 2 | 3 | 4 | 5;
type ReviewRecord = { lastPracticedAt: string; nextReviewAt: string; reviewCount: number; difficulty: ReviewDifficulty };
type PersistedProgress = { practiced: number[]; difficult: number[]; levels?: Record<string, LearningLevel>; reviews?: Record<string, ReviewRecord> };

export type ProgressApi = {
  practiced: Set<number>; difficult: Set<number>; levels: Record<number, LearningLevel>; reviews: Record<number, ReviewRecord>; ready: boolean;
  togglePracticed: (id: number) => void; toggleDifficult: (id: number) => void; setLevel: (id: number, level: LearningLevel) => void;
  review: (id: number, difficulty: ReviewDifficulty) => void; isDue: (id: number) => boolean; reset: () => void;
};

function read(): PersistedProgress {
  if (typeof window === 'undefined') return { practiced: [], difficult: [] };
  try { const value = JSON.parse(window.localStorage.getItem(KEY) ?? '{}') as Partial<PersistedProgress>; return { practiced: value.practiced ?? [], difficult: value.difficult ?? [], levels: value.levels ?? {}, reviews: value.reviews ?? {} }; } catch { return { practiced: [], difficult: [] }; }
}
function write(value: PersistedProgress) { try { window.localStorage.setItem(KEY, JSON.stringify(value)); } catch { /* privacy mode */ } }

export function useProgress(): ProgressApi {
  const [practiced, setPracticed] = useState<Set<number>>(new Set());
  const [difficult, setDifficult] = useState<Set<number>>(new Set());
  const [levels, setLevels] = useState<Record<number, LearningLevel>>({});
  const [reviews, setReviews] = useState<Record<number, ReviewRecord>>({});
  const [ready, setReady] = useState(false);
  useEffect(() => { const value = read(); setPracticed(new Set(value.practiced)); setDifficult(new Set(value.difficult)); setLevels(Object.fromEntries(Object.entries(value.levels ?? {}).map(([k, v]) => [Number(k), v]))); setReviews(Object.fromEntries(Object.entries(value.reviews ?? {}).map(([k, v]) => [Number(k), v]))); setReady(true); }, []);
  const persist = useCallback((p: Set<number>, d: Set<number>, l: Record<number, LearningLevel>, r: Record<number, ReviewRecord>) => write({ practiced: [...p], difficult: [...d], levels: l, reviews: r }), []);
  const togglePracticed = useCallback((id: number) => setPracticed((old) => { const next = new Set(old); next.has(id) ? next.delete(id) : next.add(id); persist(next, difficult, levels, reviews); return next; }), [difficult, levels, persist, reviews]);
  const toggleDifficult = useCallback((id: number) => setDifficult((old) => { const next = new Set(old); next.has(id) ? next.delete(id) : next.add(id); persist(practiced, next, levels, reviews); return next; }), [levels, persist, practiced, reviews]);
  const setLevel = useCallback((id: number, level: LearningLevel) => setLevels((old) => { const next = { ...old, [id]: level }; persist(practiced, difficult, next, reviews); return next; }), [difficult, persist, practiced, reviews]);
  const review = useCallback((id: number, difficulty: ReviewDifficulty) => { const now = new Date(); const nextDate = new Date(now); nextDate.setDate(nextDate.getDate() + ({ again: 0, hard: 1, good: 3, easy: 7 }[difficulty])); const record = { lastPracticedAt: now.toISOString(), nextReviewAt: nextDate.toISOString(), reviewCount: (reviews[id]?.reviewCount ?? 0) + 1, difficulty }; const nextReviews = { ...reviews, [id]: record }; setReviews(nextReviews); const nextPracticed = new Set(practiced).add(id); setPracticed(nextPracticed); persist(nextPracticed, difficult, levels, nextReviews); }, [difficult, levels, persist, practiced, reviews]);
  const isDue = useCallback((id: number) => Boolean(reviews[id] && new Date(reviews[id].nextReviewAt).getTime() <= Date.now()), [reviews]);
  const reset = useCallback(() => { setPracticed(new Set()); setDifficult(new Set()); setLevels({}); setReviews({}); write({ practiced: [], difficult: [], levels: {}, reviews: {} }); }, []);
  return { practiced, difficult, levels, reviews, ready, togglePracticed, toggleDifficult, setLevel, review, isDue, reset };
}
