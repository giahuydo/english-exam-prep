'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api-client';

interface ExamRow {
  id: string;
  title: string;
  status: string;
  detectedLevel: string;
  examType?: { code: string; name: string };
}

export default function AdminExamsPage() {
  const [rows, setRows] = useState<ExamRow[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .listExams()
      .then((data) => setRows(data as ExamRow[]))
      .catch((e) => setError(e instanceof Error ? e.message : 'load failed'));
  }, []);

  return (
    <section>
      <h1 className="text-xl font-semibold">Exams</h1>
      {error ? <p className="mt-2 text-red-600">{error}</p> : null}
      <table className="mt-4 w-full text-sm">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="p-2">Title</th>
            <th className="p-2">Type</th>
            <th className="p-2">Level</th>
            <th className="p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className="border-b">
              <td className="p-2">{r.title}</td>
              <td className="p-2">{r.examType?.code}</td>
              <td className="p-2">{r.detectedLevel}</td>
              <td className="p-2">{r.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
