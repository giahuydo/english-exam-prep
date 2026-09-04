export type Confidence = 'Know' | 'Unsure' | 'Guess';
export type AnswerSignal = {
  questionId: string;
  correct: boolean;
  confidence: Confidence;
  hintLevel: number;
  level?: string | null;
  topic?: { id: string; name: string; code?: string; category?: string } | null;
  answeredAt: string;
};

const KEY = 'adaptive-review-signals-v1';

export function readAnswerSignals(): AnswerSignal[] {
  if (typeof window === 'undefined') return [];
  try {
    const value = JSON.parse(window.localStorage.getItem(KEY) ?? '[]');
    return Array.isArray(value) ? value : [];
  } catch { return []; }
}

export function saveAnswerSignal(signal: AnswerSignal) {
  if (typeof window === 'undefined') return;
  const next = [signal, ...readAnswerSignals().filter((item) => item.questionId !== signal.questionId)].slice(0, 200);
  window.localStorage.setItem(KEY, JSON.stringify(next));
}

export function suggestedInterval(signal?: AnswerSignal | null): 'today' | '1d' | '3d' | '7d' {
  if (!signal || !signal.correct || signal.confidence === 'Guess' || signal.hintLevel > 0) return 'today';
  if (signal.confidence === 'Unsure') return '1d';
  return '3d';
}

export function intervalLabel(interval: ReturnType<typeof suggestedInterval>, vi = false) {
  if (vi) return { today: 'hôm nay', '1d': '1 ngày', '3d': '3 ngày', '7d': '7 ngày' }[interval];
  return { today: 'today', '1d': '1 day', '3d': '3 days', '7d': '7 days' }[interval];
}

export function isDue(nextReviewAt?: string | null) {
  return !nextReviewAt || new Date(nextReviewAt).getTime() <= Date.now();
}
