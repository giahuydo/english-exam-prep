'use client';

import { useState } from 'react';
import { api } from '@/lib/api-client';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await api.login(email, password);
      // TODO: move JWT to httpOnly cookie server-side.
      window.localStorage.setItem('accessToken', res.accessToken);
      window.localStorage.setItem('role', res.user.role);
      window.location.href = res.user.role === 'ADMIN' ? '/admin' : '/practice';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="max-w-sm">
      <h1 className="text-xl font-semibold">Login</h1>
      <form onSubmit={submit} className="mt-4 space-y-3">
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
          />
        </div>
        <button
          className="rounded bg-black px-3 py-1.5 text-sm text-white disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
      </form>
    </section>
  );
}
