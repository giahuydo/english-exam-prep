'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api-client';
import { learnerExamLabel, isHcmusContext } from '@app/shared';

interface ExamTypeRow {
  id: string;
  code: string;
  name: string;
  description?: string | null;
}

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [examTypeId, setExamTypeId] = useState<string>('');
  const [examTypes, setExamTypes] = useState<ExamTypeRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api
      .listExamTypes()
      .then((rows) => setExamTypes(rows as ExamTypeRow[]))
      .catch(() => setExamTypes([]));
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await api.register({
        email,
        password,
        name,
        examTypeId: examTypeId || undefined,
      });
      window.localStorage.setItem('accessToken', res.accessToken);
      window.localStorage.setItem('role', res.user.role);
      window.location.href = '/dashboard';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Register failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="max-w-sm">
      <h1 className="text-xl font-semibold">Register</h1>
      <form onSubmit={submit} className="mt-4 space-y-3">
        <div>
          <label className="block text-sm">Name</label>
          <input
            className="w-full rounded border px-2 py-1"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm">Email</label>
          <input
            className="w-full rounded border px-2 py-1"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm">Password</label>
          <input
            className="w-full rounded border px-2 py-1"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
          />
        </div>
        <div>
          <label className="block text-sm">Study target (optional)</label>
          <p className="mb-1 text-xs text-gray-500">Choose a VSTEP proficiency target. HCMUS is available only as an orientation context.</p>
          <select
            className="w-full rounded border px-2 py-1"
            value={examTypeId}
            onChange={(e) => setExamTypeId(e.target.value)}
          >
            <option value="">-- pick later --</option>
            {examTypes.map((t) => (
              <option key={t.id} value={t.id}>
                {learnerExamLabel(t.code, t.name)}{isHcmusContext(t.code) ? ' · orientation context' : ''}
              </option>
            ))}
          </select>
        </div>
        <button
          className="rounded bg-black px-3 py-1.5 text-sm text-white disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create account'}
        </button>
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
      </form>
    </section>
  );
}
