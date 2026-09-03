'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api-client';

interface BlueprintItem {
  id: string;
  sectionName: string;
  weight: number;
  questionCount: number;
  questionTypeId?: string | null;
  topicId?: string | null;
}

interface BlueprintRow {
  id: string;
  name: string;
  version: number;
  status: string;
  totalDurationMinutes?: number | null;
  createdAt: string;
  examType?: { id: string; code: string; name: string } | null;
  items: BlueprintItem[];
}

export default function AdminBlueprintsPage() {
  const [rows, setRows] = useState<BlueprintRow[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .listBlueprints()
      .then((data) => setRows(data as BlueprintRow[]))
      .catch((e) => setError(e instanceof Error ? e.message : 'load failed'));
  }, []);

  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <section className="grid gap-4">
      <h1 className="text-xl font-semibold">Exam Blueprints</h1>
      <p className="text-sm text-gray-600">
        Blueprints define how mock exams are composed. Editing is not yet wired up.
      </p>

      {rows.length === 0 ? (
        <p className="text-sm text-gray-500">No blueprints found.</p>
      ) : null}

      {rows.map((b) => {
        const totalWeight = b.items.reduce((s, it) => s + it.weight, 0);
        return (
          <div key={b.id} className="rounded border bg-white p-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold">
                  {b.name} <span className="text-xs text-gray-500">v{b.version}</span>
                </h2>
                <p className="text-xs text-gray-500">
                  {b.examType?.name ?? '-'} ({b.examType?.code ?? '-'}) · {b.status}
                  {b.totalDurationMinutes ? ` · ${b.totalDurationMinutes} min` : ''}
                </p>
              </div>
              <span className="text-xs text-gray-500">{b.items.length} sections</span>
            </div>
            <table className="mt-3 w-full text-sm">
              <thead className="bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
                <tr>
                  <th className="px-2 py-1">Section</th>
                  <th className="px-2 py-1">Weight</th>
                  <th className="px-2 py-1">Share</th>
                  <th className="px-2 py-1">Question count</th>
                </tr>
              </thead>
              <tbody>
                {b.items.map((it) => (
                  <tr key={it.id} className="border-t">
                    <td className="px-2 py-1">{it.sectionName}</td>
                    <td className="px-2 py-1">{it.weight}</td>
                    <td className="px-2 py-1">
                      {totalWeight > 0 ? Math.round((it.weight / totalWeight) * 100) : 0}%
                    </td>
                    <td className="px-2 py-1">{it.questionCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}
    </section>
  );
}
