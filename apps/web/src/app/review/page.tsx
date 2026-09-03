'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { api } from '@/lib/api-client';

interface AttemptRow {
  id: string;
  isCorrect: boolean | null;
  hintLevelUsed: number;
  answerText?: string | null;
  question: {
    id: string;
    content: string;
    explanation?: string | null;
    options: Array<{ id: string; optionKey: string; content: string; isCorrect: boolean; explanation?: string | null }>;
    questionType?: { id: string; code: string; name: string; category: string } | null;
  };
  selectedOption?: { id: string; optionKey: string; content: string; isCorrect: boolean } | null;
}

interface SessionShape {
  id: string;
  type: string;
  status: string;
  score: number;
  correctCount: number;
  totalQuestions: number;
  startedAt: string;
  completedAt?: string | null;
}

function ReviewInner() {
  const params = useSearchParams();
  const sessionId = params.get('sessionId') ?? '';
  const [session, setSession] = useState<SessionShape | null>(null);
  const [attempts, setAttempts] = useState<AttemptRow[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) return;
    void (async () => {
      try {
        const [s, a] = await Promise.all([
          api.getPracticeSession(sessionId),
          api.listAttempts(sessionId),
        ]);
        setSession(s as SessionShape);
        setAttempts(a as AttemptRow[]);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'load failed');
      }
    })();
  }, [sessionId]);

  if (!sessionId) return <p className="text-sm text-gray-600">Missing sessionId in URL.</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!session) return <p>Loading...</p>;

  return (
    <section className="grid gap-4">
      <div>
        <h1 className="text-xl font-semibold">Session Review</h1>
        <p className="mt-1 text-sm text-gray-600">
          {session.type} · {session.status} · Score {Math.round(session.score * 100)}% (
          {session.correctCount}/{session.totalQuestions})
        </p>
      </div>

      {attempts.length === 0 ? (
        <p className="text-sm text-gray-500">No attempts recorded for this session.</p>
      ) : null}

      {attempts.map((att, idx) => {
        const correctOpt = att.question.options.find((o) => o.isCorrect);
        return (
          <div key={att.id} className="rounded border bg-white p-4">
            <p className="font-medium">
              {idx + 1}. {att.question.content}
            </p>
            <p className="mt-1 text-xs text-gray-500">
              {att.question.questionType?.name ?? ''} · Hint level used: {att.hintLevelUsed}
            </p>
            <ul className="mt-2 grid gap-1 text-sm">
              {att.question.options.map((o) => {
                const isPicked = att.selectedOption?.id === o.id;
                const tone = o.isCorrect
                  ? 'border-green-600 bg-green-50'
                  : isPicked
                    ? 'border-red-300 bg-red-50'
                    : 'border-gray-200';
                return (
                  <li key={o.id} className={`rounded border px-2 py-1 ${tone}`}>
                    <strong>{o.optionKey}.</strong> {o.content}
                    {isPicked ? <em className="ml-2 text-xs text-gray-600">(your pick)</em> : null}
                    {!o.isCorrect && o.explanation ? (
                      <span className="mt-1 block text-xs text-red-700">{o.explanation}</span>
                    ) : null}
                  </li>
                );
              })}
            </ul>
            <div className="mt-3 text-sm">
              <p className={att.isCorrect ? 'text-green-700' : 'text-red-700'}>
                {att.isCorrect ? 'Correct' : `Incorrect${correctOpt ? ` — answer: ${correctOpt.optionKey}` : ''}`}
              </p>
              {att.question.explanation ? (
                <p className="mt-1 text-gray-700">{att.question.explanation}</p>
              ) : null}
            </div>
          </div>
        );
      })}

      <div className="flex gap-3">
        <Link className="text-sm text-blue-600 underline" href="/dashboard">
          Back to dashboard
        </Link>
        <Link className="text-sm text-blue-600 underline" href="/practice">
          Practice again
        </Link>
      </div>
    </section>
  );
}

export default function ReviewPage() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <ReviewInner />
    </Suspense>
  );
}
