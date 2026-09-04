'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api-client';
import { learnerCopy, useLanguage } from '@/lib/language';
import { StudentShell } from '@/components/shells';

interface MistakeRow {
  id: string;
  createdAt: string;
  question: {
    id: string;
    content: string;
    explanation?: string | null;
    questionType?: { id: string; code: string; name: string; category: string } | null;
    options: Array<{ id: string; optionKey: string; content: string; isCorrect: boolean }>;
    topics: Array<{
      isPrimary: boolean;
      topic: { id: string; code: string; name: string; category: string };
    }>;
  };
}

export default function MistakesPage() {
  const copy = learnerCopy[useLanguage().language];
  const [rows, setRows] = useState<MistakeRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    api
      .myMistakes()
      .then((data) => setRows(data as MistakeRow[]))
      .catch((e) => setError(e instanceof Error ? e.message : 'load failed'));
  }, []);

  async function startReview() {
    setStarting(true);
    try {
      const res = await api.startPractice({
        mode: 'MISTAKE_REVIEW',
        totalQuestions: Math.min(20, rows.length || 10),
      });
      window.location.href = `/practice/${res.session.id}`;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'start failed');
    } finally {
      setStarting(false);
    }
  }

  if (error)
    return (
      <StudentShell>
        <p className="text-red-600">{error}</p>
      </StudentShell>
    );

  return (
    <StudentShell>
      <section className="grid gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">{copy.mistakesTitle}</h1>
            <p className="mt-1 text-sm text-gray-600">{copy.mistakesDescription(rows.length)}</p>
          </div>
          <button
            onClick={startReview}
            disabled={starting || rows.length === 0}
            className="rounded bg-black px-3 py-1.5 text-sm text-white disabled:opacity-50"
          >
            {starting ? copy.starting : copy.startMistakeReview}
          </button>
        </div>

        {rows.length === 0 ? <p className="text-sm text-gray-500">{copy.noMistakes}</p> : null}

        {rows.map((r) => {
          const correct = r.question.options.find((o) => o.isCorrect);
          const primary = r.question.topics.find((t) => t.isPrimary)?.topic;
          return (
            <div key={r.id} className="rounded border bg-white p-4">
              <p className="font-medium">{r.question.content}</p>
              <p className="mt-1 text-xs text-gray-500">
                {r.question.questionType?.name ?? ''} {primary ? `· ${primary.name}` : ''}
              </p>
              {correct ? (
                <p className="mt-2 text-sm text-green-700">
                  {copy.answer} {correct.optionKey}. {correct.content}
                </p>
              ) : null}
              {r.question.explanation ? (
                <p className="mt-1 text-sm text-gray-700">{r.question.explanation}</p>
              ) : null}
            </div>
          );
        })}

        <div>
          <Link className="text-sm text-blue-600 underline" href="/dashboard">
            {copy.backDashboardLong}
          </Link>
        </div>
      </section>
    </StudentShell>
  );
}
