'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api-client';

interface ExamTypeRow {
  id: string;
  code: string;
  name: string;
}

interface BlueprintRow {
  id: string;
  name: string;
  version: number;
  status: string;
  totalDurationMinutes?: number | null;
  examType?: { id: string; code: string; name: string } | null;
  items: Array<{ id: string; sectionName: string; weight: number }>;
}

interface SessionRow {
  id: string;
  status: string;
  score: number;
  correctCount: number;
  totalQuestions: number;
  startedAt: string;
  blueprint?: { id: string; name: string; version: number } | null;
  examType?: { id: string; code: string; name: string } | null;
}

export default function MockExamsPage() {
  const [examTypes, setExamTypes] = useState<ExamTypeRow[]>([]);
  const [blueprints, setBlueprints] = useState<BlueprintRow[]>([]);
  const [sessions, setSessions] = useState<SessionRow[]>([]);
  const [selectedExamType, setSelectedExamType] = useState('');
  const [totalQuestions, setTotalQuestions] = useState(20);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void Promise.all([api.listExamTypes(), api.listBlueprints(), api.listMockExams()])
      .then(([et, bp, s]) => {
        setExamTypes(et as ExamTypeRow[]);
        setBlueprints(bp as BlueprintRow[]);
        setSessions(s as SessionRow[]);
      })
      .catch((e) => setError(e instanceof Error ? e.message : 'load failed'));
  }, []);

  const filteredBlueprints = selectedExamType
    ? blueprints.filter((b) => b.examType?.id === selectedExamType)
    : blueprints;

  async function start(blueprintId: string, examTypeId: string) {
    setStarting(true);
    try {
      const res = await api.startMockExam({ examTypeId, blueprintId, totalQuestions });
      window.location.href = `/mock-exams/${res.session.id}`;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'start failed');
    } finally {
      setStarting(false);
    }
  }

  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <section className="grid gap-6">
      <div>
        <h1 className="text-xl font-semibold">Mock exams</h1>
        <p className="mt-1 text-sm text-gray-600">
          Start a full-length mock exam based on a blueprint, or continue a past attempt.
        </p>
      </div>

      <div className="rounded border bg-white p-4">
        <h2 className="font-semibold">Start new</h2>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          <div>
            <label className="block text-xs uppercase tracking-wide text-gray-500">
              Exam type
            </label>
            <select
              className="mt-1 w-full rounded border px-2 py-1 text-sm"
              value={selectedExamType}
              onChange={(e) => setSelectedExamType(e.target.value)}
            >
              <option value="">All</option>
              {examTypes.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} ({t.code})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wide text-gray-500">
              Total questions
            </label>
            <input
              type="number"
              min={5}
              max={100}
              className="mt-1 w-full rounded border px-2 py-1 text-sm"
              value={totalQuestions}
              onChange={(e) => setTotalQuestions(parseInt(e.target.value, 10) || 20)}
            />
          </div>
        </div>

        <div className="mt-4 grid gap-2">
          {filteredBlueprints.length === 0 ? (
            <p className="text-sm text-gray-500">No blueprints available for this exam type.</p>
          ) : (
            filteredBlueprints.map((b) => (
              <div key={b.id} className="flex items-center justify-between rounded border px-3 py-2 text-sm">
                <div>
                  <div className="font-medium">
                    {b.name} <span className="text-xs text-gray-500">v{b.version}</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {b.examType?.name ?? '-'} · {b.items.length} sections
                    {b.totalDurationMinutes ? ` · ${b.totalDurationMinutes} min` : ''}
                  </div>
                </div>
                <button
                  disabled={starting || !b.examType}
                  onClick={() => b.examType && start(b.id, b.examType.id)}
                  className="rounded bg-black px-3 py-1 text-white disabled:opacity-50"
                >
                  Start
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="rounded border bg-white p-4">
        <h2 className="font-semibold">Past mock exams</h2>
        <ul className="mt-2 space-y-1 text-sm">
          {sessions.length === 0 ? (
            <li className="text-gray-500">No mock exams yet.</li>
          ) : (
            sessions.map((s) => (
              <li key={s.id} className="flex items-center justify-between">
                <span>
                  {s.blueprint?.name ?? 'Custom'} — {s.correctCount}/{s.totalQuestions} (
                  {Math.round(s.score * 100)}%){' '}
                  <span className="text-xs text-gray-500">{s.status}</span>
                </span>
                <Link
                  className="text-xs text-blue-600 underline"
                  href={`/mock-exams/${s.id}`}
                >
                  Open
                </Link>
              </li>
            ))
          )}
        </ul>
      </div>

      <div>
        <Link className="text-sm text-blue-600 underline" href="/dashboard">
          Back to dashboard
        </Link>
      </div>
    </section>
  );
}
