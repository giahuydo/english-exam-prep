const BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3001';

function authHeader(): HeadersInit {
  if (typeof window === 'undefined') return {};
  const token = window.localStorage.getItem('accessToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function apiFetch<T = unknown>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      'content-type': 'application/json',
      ...authHeader(),
      ...(init.headers ?? {}),
    },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`API ${res.status}: ${body}`);
  }
  const contentType = res.headers.get('content-type') ?? '';
  if (contentType.includes('application/json')) {
    return (await res.json()) as T;
  }
  return undefined as T;
}

export interface StartPracticePayload {
  mode?:
    | 'MIXED_PRACTICE'
    | 'TOPIC_PRACTICE'
    | 'CUSTOM_PRACTICE'
    | 'MOCK_EXAM'
    | 'MISTAKE_REVIEW';
  totalQuestions?: number;
  topicId?: string;
  topicIds?: string[];
  examTypeId?: string;
  blueprintId?: string;
}

export const api = {
  register: (payload: { email: string; password: string; name: string; examTypeId?: string }) =>
    apiFetch<{ accessToken: string; user: { id: string; email: string; role: string } }>(
      '/auth/register',
      { method: 'POST', body: JSON.stringify(payload) },
    ),
  login: (email: string, password: string) =>
    apiFetch<{ accessToken: string; user: { id: string; email: string; role: string } }>(
      '/auth/login',
      { method: 'POST', body: JSON.stringify({ email, password }) },
    ),
  me: () =>
    apiFetch<{
      id: string;
      email: string;
      role: string;
      currentExamTypeId?: string | null;
      currentExamType?: { id: string; code: string; name: string } | null;
    }>('/me'),
  dashboard: () => apiFetch<Record<string, unknown>>('/me/dashboard'),
  updateStudyTarget: (examTypeId: string) =>
    apiFetch<{ id: string; currentExamTypeId: string }>('/me/study-target', {
      method: 'PATCH',
      body: JSON.stringify({ examTypeId }),
    }),
  myMistakes: () => apiFetch<unknown[]>('/me/mistakes'),
  listExams: () => apiFetch<unknown[]>('/admin/exams'),
  listQuestions: () => apiFetch<unknown[]>('/admin/questions'),
  getQuestion: (id: string) => apiFetch<unknown>(`/admin/questions/${id}`),
  topicsTree: () => apiFetch<unknown[]>('/admin/topics/tree'),
  listBlueprints: (examTypeId?: string) =>
    apiFetch<unknown[]>(
      `/mock-exams/blueprints${examTypeId ? `?examTypeId=${examTypeId}` : ''}`,
    ),
  listMockExams: () => apiFetch<unknown[]>('/mock-exams'),
  getMockExam: (id: string) => apiFetch<unknown>(`/mock-exams/${id}`),
  startMockExam: (payload: {
    examTypeId: string;
    blueprintId?: string;
    totalQuestions?: number;
    durationSeconds?: number;
  }) =>
    apiFetch<{ session: { id: string }; questions: unknown[]; blueprint: unknown }>(
      '/mock-exams',
      { method: 'POST', body: JSON.stringify(payload) },
    ),
  getMockState: (id: string) => apiFetch<unknown>(`/mock-exams/${id}`),
  saveMockAnswer: (id: string, payload: { questionId: string; selectedOptionId?: string; answerText?: string; currentQuestionIndex?: number }) => apiFetch<unknown>(`/mock-exams/${id}/answers`, { method: 'POST', body: JSON.stringify(payload) }),
  pauseMock: (id: string) => apiFetch<unknown>(`/mock-exams/${id}/pause`, { method: 'POST' }),
  resumeMock: (id: string) => apiFetch<unknown>(`/mock-exams/${id}/resume`, { method: 'POST' }),
  submitMock: (id: string) => apiFetch<unknown>(`/mock-exams/${id}/submit`, { method: 'POST' }),
  startPractice: (payload: StartPracticePayload = {}) =>
    apiFetch<{ session: { id: string }; questions: unknown[] }>('/practice/sessions', {
      method: 'POST',
      body: JSON.stringify({
        type: payload.mode ?? 'MIXED_PRACTICE',
        totalQuestions: payload.totalQuestions ?? 5,
        topicId: payload.topicId,
        topicIds: payload.topicIds ?? [],
        examTypeId: payload.examTypeId,
        blueprintId: payload.blueprintId,
      }),
    }),
  getPracticeSession: (id: string) => apiFetch<unknown>(`/practice/sessions/${id}`),
  submitAnswer: (
    sessionId: string,
    payload: {
      questionId: string;
      selectedOptionId?: string;
      answerText?: string;
      hintLevelUsed?: number;
      timeSpentSeconds?: number;
      language?: 'en' | 'vi';
    },
  ) =>
    apiFetch<{
      attemptId: string;
      isCorrect: boolean | null;
      correctOptionId?: string | null;
      correctOptionKey?: string | null;
      explanation: string | null;
      ruleStructure: string | null;
      commonMistake: string | null;
      example: string | null;
      wrongOptionExplanations: Array<{
        optionId: string;
        optionKey: string;
        explanation: string | null;
      }>;
      hintLevelUsed: number;
    }>(`/practice/sessions/${sessionId}/answers`, {
      method: 'POST',
      body: JSON.stringify({
        hintLevelUsed: 0,
        ...payload,
      }),
    }),
  revealHint: (sessionId: string, questionId: string, hintLevel: 1 | 2 | 3) =>
    apiFetch<{ hintLevel: number; hint: string | null }>(
      `/practice/sessions/${sessionId}/questions/${questionId}/hint`,
      { method: 'POST', body: JSON.stringify({ hintLevel }) },
    ),
  completeSession: (sessionId: string) =>
    apiFetch<unknown>(`/practice/sessions/${sessionId}/complete`, { method: 'POST' }),
  myStats: () => apiFetch<unknown[]>('/me/stats'),
  listExamTypes: () => apiFetch<unknown[]>('/exam-types'),
  listTopics: () => apiFetch<unknown[]>('/topics'),
  listLearningScopes: () => apiFetch<unknown[]>('/learning/scopes'),
  getLearningScopeLesson: (id: string) => apiFetch<unknown>(`/learning/scopes/${id}/lesson`),
  startLearningCheckpoint: (id: string) => apiFetch<{ session: { id: string } }>(`/learning/scopes/${id}/checkpoint`, { method: 'POST' }),
  listAttempts: (sessionId?: string) =>
    apiFetch<unknown[]>(`/me/attempts${sessionId ? `?sessionId=${sessionId}` : ''}`),
  getAttempt: (id: string) => apiFetch<unknown>(`/me/attempts/${id}`),
};
