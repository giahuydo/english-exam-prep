'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function AdminDashboard() {
  useEffect(() => {
    const role = typeof window !== 'undefined' ? window.localStorage.getItem('role') : null;
    if (role !== 'ADMIN') window.location.href = '/login';
  }, []);

  return (
    <section>
      <h1 className="text-xl font-semibold">Admin Dashboard</h1>
      <ul className="mt-4 grid gap-2">
        <li>
          <Link className="text-blue-600 underline" href="/admin/exams">Exams</Link>
        </li>
        <li>
          <Link className="text-blue-600 underline" href="/admin/questions">Questions</Link>
        </li>
        <li>
          <Link className="text-blue-600 underline" href="/admin/topics">Topics</Link>
        </li>
      </ul>
    </section>
  );
}
