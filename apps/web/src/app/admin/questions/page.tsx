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
      <h1 className="text-xl font-semibold">Questions</h1>
      {error ? <p className="mt-2 text-red-600">{error}</p> : null}
      <table className="mt-4 w-full text-sm">
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
      </table>
    </section>
  );
}
