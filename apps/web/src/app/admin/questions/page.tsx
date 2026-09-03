'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api-client';

interface QuestionRow {
  id: string;
  content: string;
  status: string;
  level: string;
  difficulty: string;
  questionType?: { code: string; name: string };
}

export default function AdminQuestionsPage() {
  const [rows, setRows] = useState<QuestionRow[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .listQuestions()
      .then((data) => setRows(data as QuestionRow[]))
      .catch((e) => setError(e instanceof Error ? e.message : 'load failed'));
  }, []);

  return (
    <section>
      <div className="mb-6 flex items-end justify-between"><div><p className="text-xs font-bold uppercase tracking-widest text-blue-600">Content library</p><h1 className="mt-1 text-3xl font-bold text-white">Questions</h1><p className="mt-2 text-sm text-slate-400">Browse, review and refine your question bank.</p></div><button className="min-h-10 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white">+ New question</button></div>
      {error ? <p className="mt-2 text-red-400">{error}</p> : null}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white"><table className="w-full text-sm">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="p-2">Content</th>
            <th className="p-2">Type</th>
            <th className="p-2">Level</th>
            <th className="p-2">Difficulty</th>
            <th className="p-2">Status</th>
            <th className="p-2"></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className="border-b">
              <td className="max-w-md truncate p-2">{r.content}</td>
              <td className="p-2">{r.questionType?.code}</td>
              <td className="p-2">{r.level}</td>
              <td className="p-2">{r.difficulty}</td>
              <td className="p-2">{r.status}</td>
              <td className="p-2">
                <Link className="text-blue-600 underline" href={`/admin/questions/${r.id}`}>
                  edit
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table></div>
    </section>
  );
}
