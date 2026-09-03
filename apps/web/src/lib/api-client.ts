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

export const api = {
  login: (email: string, password: string) =>
    apiFetch<{ accessToken: string; user: { id: string; email: string; role: string } }>(
      '/auth/login',
      { method: 'POST', body: JSON.stringify({ email, password }) },
    ),
  me: () => apiFetch<{ id: string; email: string; role: string }>('/me'),
  listExams: () => apiFetch<unknown[]>('/admin/exams'),
  listQuestions: () => apiFetch<unknown[]>('/admin/questions'),
  getQuestion: (id: string) => apiFetch<unknown>(`/admin/questions/${id}`),
  topicsTree: () => apiFetch<unknown[]>('/admin/topics/tree'),
  startPractice: (total = 5) =>
    apiFetch<{ session: { id: string }; questions: unknown[] }>('/practice/sessions', {
      method: 'POST',
      body: JSON.stringify({ totalQuestions: total }),
    }),
};
