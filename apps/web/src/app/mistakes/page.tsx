'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api-client';

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

  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <section className="grid gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Your mistakes</h1>
          <p className="mt-1 text-sm text-gray-600">
            {rows.length} distinct question{rows.length === 1 ? '' : 's'} answered incorrectly.
          </p>
        </div>
        <button
          onClick={startReview}
          disabled={starting || rows.length === 0}
          className="rounded bg-black px-3 py-1.5 text-sm text-white disabled:opacity-50"
        >
          {starting ? 'Starting...' : 'Start mistake review'}
        </button>
      </div>

      {rows.length === 0 ? (
        <p className="text-sm text-gray-500">No mistakes yet — take some practice runs.</p>
      ) : null}

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
                Answer: {correct.optionKey}. {correct.content}
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
          Back to dashboard
        </Link>
      </div>
    </section>
  );
}
