'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api-client';

interface TopicStatRow {
  id: string;
  topicId: string;
  attemptCount: number;
  correctCount: number;
  accuracy: number;
  masteryScore: number;
  streak: number;
  lastPracticedAt?: string | null;
  topic: { code: string; name: string; category: string };
}

export default function ProgressPage() {
  const [rows, setRows] = useState<TopicStatRow[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .myStats()
      .then((data) => setRows(data as TopicStatRow[]))
      .catch((e) => setError(e instanceof Error ? e.message : 'load failed'));
  }, []);

  const grouped = useMemo(() => {
    const byCategory: Record<string, TopicStatRow[]> = {};
    for (const r of rows) {
      const cat = r.topic.category ?? 'OTHER';
      byCategory[cat] = byCategory[cat] ?? [];
      byCategory[cat].push(r);
    }
    for (const cat of Object.keys(byCategory)) {
      byCategory[cat].sort((a, b) => b.masteryScore - a.masteryScore);
    }
    return byCategory;
  }, [rows]);

  if (error) return <p className="text-red-600">{error}</p>;

  const totalAttempts = rows.reduce((sum, r) => sum + r.attemptCount, 0);
  const totalCorrect = rows.reduce((sum, r) => sum + r.correctCount, 0);
  const overall = totalAttempts === 0 ? 0 : totalCorrect / totalAttempts;

  return (
    <section className="grid gap-6">
      <div>
        <h1 className="text-xl font-semibold">Progress</h1>
        <p className="mt-1 text-sm text-gray-600">
          Overall accuracy: <strong>{Math.round(overall * 100)}%</strong> across{' '}
          {totalAttempts} attempts on {rows.length} topics.
        </p>
      </div>

      {rows.length === 0 ? (
        <p className="text-sm text-gray-500">No stats yet — take a practice run to build them.</p>
      ) : null}

      {Object.entries(grouped).map(([category, list]) => (
        <div key={category} className="rounded border bg-white p-4">
          <h2 className="font-semibold">{category}</h2>
          <table className="mt-2 w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-gray-500">
                <th className="py-1">Topic</th>
                <th className="py-1">Mastery</th>
                <th className="py-1">Accuracy</th>
                <th className="py-1">Attempts</th>
                <th className="py-1">Streak</th>
              </tr>
            </thead>
            <tbody>
              {list.map((r) => (
                <tr key={r.id} className="border-t">
                  <td className="py-1">
                    <Link className="text-blue-600 underline" href={`/learn/${r.topic.code}`}>
                      {r.topic.name}
                    </Link>
                  </td>
                  <td className="py-1">{Math.round(r.masteryScore * 100)}%</td>
                  <td className="py-1">{Math.round(r.accuracy * 100)}%</td>
                  <td className="py-1">
                    {r.correctCount}/{r.attemptCount}
                  </td>
                  <td className="py-1">{r.streak}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}

      <div>
        <Link className="text-sm text-blue-600 underline" href="/dashboard">
          Back to dashboard
        </Link>
      </div>
    </section>
  );
}
