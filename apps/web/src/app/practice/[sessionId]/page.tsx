'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api-client';

interface QuestionOption {
  id: string;
  optionKey: string;
  content: string;
}

interface PracticeQuestion {
  id: string;
  content: string;
  instruction?: string | null;
  options: QuestionOption[];
  hint1?: string | null;
  hint2?: string | null;
  hint3?: string | null;
}

interface AnswerResult {
  attemptId: string;
  isCorrect: boolean | null;
  correctOptionId?: string | null;
  correctOptionKey?: string | null;
  explanation: string | null;
  wrongOptionExplanations: Array<{
    optionId: string;
    optionKey: string;
    explanation: string | null;
  }>;
  hintLevelUsed: number;
}

interface SessionShape {
  id: string;
  status: string;
  score: number;
  correctCount: number;
  totalQuestions: number;
}

export default function PracticeSessionPage({ params }: { params: { sessionId: string } }) {
  const [session, setSession] = useState<SessionShape | null>(null);
  const [questions, setQuestions] = useState<PracticeQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, AnswerResult>>({});
  const [hintsShown, setHintsShown] = useState<Record<string, number>>({});
  const [hintText, setHintText] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      try {
        const s = (await api.getPracticeSession(params.sessionId)) as SessionShape & {
          questions?: Array<{ question: PracticeQuestion }>;
        };
        setSession(s);
        // Load session questions via /me/attempts or embedded — for now,
        // re-hit dashboard-like fetch: reuse the getPracticeSession payload.
        const qList: PracticeQuestion[] =
          (s.questions as { question: PracticeQuestion }[] | undefined)?.map((r) => r.question) ??
          [];
        setQuestions(qList);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'load failed');
      }
    })();
  }, [params.sessionId]);

  async function pickOption(q: PracticeQuestion, optId: string) {
    const res = await api.submitAnswer(params.sessionId, {
      questionId: q.id,
      selectedOptionId: optId,
      hintLevelUsed: hintsShown[q.id] ?? 0,
    });
    setAnswers((a) => ({ ...a, [q.id]: res }));
  }

  async function revealHint(q: PracticeQuestion, level: 1 | 2 | 3) {
    const res = await api.revealHint(params.sessionId, q.id, level);
    setHintsShown((h) => ({ ...h, [q.id]: level }));
    if (res.hint) setHintText((t) => ({ ...t, [`${q.id}_${level}`]: res.hint! }));
  }

  async function complete() {
    await api.completeSession(params.sessionId);
    window.location.href = '/review?sessionId=' + params.sessionId;
  }

  if (error) return <p className="text-red-600">{error}</p>;
  if (!session) return <p>Loading...</p>;

  return (
    <section className="grid gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Practice — {session.id.slice(0, 8)}</h1>
        <button className="rounded border px-3 py-1.5 text-sm" onClick={complete}>
          Finish
        </button>
      </div>

      {questions.length === 0 ? (
        <p className="text-sm text-gray-500">No questions in this session.</p>
      ) : null}

      {questions.map((q, idx) => {
        const result = answers[q.id];
        const revealed = hintsShown[q.id] ?? 0;
        return (
          <div key={q.id} className="rounded border bg-white p-4">
            <p className="font-medium">
              {idx + 1}. {q.content}
            </p>
            {q.instruction ? (
              <p className="mt-1 text-xs text-gray-500">{q.instruction}</p>
            ) : null}
            <ul className="mt-2 grid gap-1">
              {q.options.map((o) => {
                const isCorrect = result?.correctOptionId === o.id;
                const wrongExplanation = result?.wrongOptionExplanations.find(
                  (w) => w.optionId === o.id,
                );
                return (
                  <li key={o.id}>
                    <button
                      disabled={!!result}
                      onClick={() => pickOption(q, o.id)}
                      className={`w-full rounded border px-2 py-1 text-left text-sm ${
                        result
                          ? isCorrect
                            ? 'border-green-600 bg-green-50'
                            : wrongExplanation
                              ? 'border-red-300 bg-red-50'
                              : 'opacity-60'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <strong>{o.optionKey}.</strong> {o.content}
                      {result && wrongExplanation?.explanation ? (
                        <span className="mt-1 block text-xs text-red-700">
                          {wrongExplanation.explanation}
                        </span>
                      ) : null}
                    </button>
                  </li>
                );
              })}
            </ul>

            {result ? (
              <div className="mt-3 text-sm">
                <p className={result.isCorrect ? 'text-green-700' : 'text-red-700'}>
                  {result.isCorrect ? 'Correct!' : 'Incorrect.'}
                  {result.correctOptionKey && !result.isCorrect
                    ? ` Answer: ${result.correctOptionKey}`
                    : null}
                </p>
                {result.explanation ? (
                  <p className="mt-1 text-gray-700">{result.explanation}</p>
                ) : null}
              </div>
            ) : (
              <div className="mt-3 flex gap-2 text-xs">
                {[1, 2, 3].map((lv) => {
                  const has = (q as unknown as Record<string, string | null>)[`hint${lv}`];
                  if (!has) return null;
                  return (
                    <button
                      key={lv}
                      className="rounded border px-2 py-1 disabled:opacity-50"
                      disabled={revealed >= lv}
                      onClick={() => revealHint(q, lv as 1 | 2 | 3)}
                    >
                      {revealed >= lv ? `Hint ${lv} shown` : `Reveal hint ${lv}`}
                    </button>
                  );
                })}
              </div>
            )}

            {[1, 2, 3].map((lv) => {
              const text = hintText[`${q.id}_${lv}`];
              if (!text) return null;
              return (
                <p key={lv} className="mt-1 text-xs text-blue-700">
                  Hint {lv}: {text}
                </p>
              );
            })}
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
