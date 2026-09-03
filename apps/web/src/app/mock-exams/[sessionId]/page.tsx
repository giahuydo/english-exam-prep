'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api-client';

interface QuestionOption {
  id: string;
  optionKey: string;
  content: string;
}

interface MockQuestion {
  id: string;
  content: string;
  instruction?: string | null;
  options: QuestionOption[];
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

interface MockSessionShape {
  id: string;
  status: string;
  score: number;
  correctCount: number;
  totalQuestions: number;
  blueprint?: { id: string; name: string; version: number } | null;
  questions?: Array<{ question: MockQuestion }>;
}

export default function MockExamSessionPage() {
  const params = useParams<{ sessionId: string }>();
  const [session, setSession] = useState<MockSessionShape | null>(null);
  const [questions, setQuestions] = useState<MockQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, AnswerResult>>({});
  const [error, setError] = useState<string | null>(null);
  const [completing, setCompleting] = useState(false);

  useEffect(() => {
    void (async () => {
      try {
        const s = (await api.getMockExam(params.sessionId)) as MockSessionShape;
        setSession(s);
        const qs = s.questions?.map((r) => r.question) ?? [];
        setQuestions(qs);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'load failed');
      }
    })();
  }, [params.sessionId]);

  async function pick(q: MockQuestion, optId: string) {
    const res = await api.submitAnswer(params.sessionId, {
      questionId: q.id,
      selectedOptionId: optId,
      hintLevelUsed: 0,
    });
    setAnswers((a) => ({ ...a, [q.id]: res }));
  }

  async function finish() {
    setCompleting(true);
    try {
      await api.completeSession(params.sessionId);
      window.location.href = '/review?sessionId=' + params.sessionId;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'finish failed');
    } finally {
      setCompleting(false);
    }
  }

  if (error) return <p className="text-red-600">{error}</p>;
  if (!session) return <p>Loading...</p>;

  const answered = Object.keys(answers).length;

  return (
    <section className="grid gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">
            Mock Exam — {session.blueprint?.name ?? session.id.slice(0, 8)}
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Answered {answered} / {questions.length} · Status: {session.status}
          </p>
        </div>
        <button
          onClick={finish}
          disabled={completing}
          className="rounded bg-black px-3 py-1.5 text-sm text-white disabled:opacity-50"
        >
          {completing ? 'Finishing...' : 'Finish exam'}
        </button>
      </div>

      {questions.length === 0 ? (
        <p className="text-sm text-gray-500">No questions in this mock exam.</p>
      ) : null}

      {questions.map((q, idx) => {
        const result = answers[q.id];
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
                const wrong = result?.wrongOptionExplanations.find((w) => w.optionId === o.id);
                return (
                  <li key={o.id}>
                    <button
                      disabled={!!result}
                      onClick={() => pick(q, o.id)}
                      className={`w-full rounded border px-2 py-1 text-left text-sm ${
                        result
                          ? isCorrect
                            ? 'border-green-600 bg-green-50'
                            : wrong
                              ? 'border-red-300 bg-red-50'
                              : 'opacity-60'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <strong>{o.optionKey}.</strong> {o.content}
                    </button>
                  </li>
                );
              })}
            </ul>
            {result ? (
              <div className="mt-3 text-sm">
                <p className={result.isCorrect ? 'text-green-700' : 'text-red-700'}>
                  {result.isCorrect ? 'Correct' : 'Incorrect'}
                  {result.correctOptionKey && !result.isCorrect
                    ? ` — answer: ${result.correctOptionKey}`
                    : null}
                </p>
                {result.explanation ? (
                  <p className="mt-1 text-gray-700">{result.explanation}</p>
                ) : null}
              </div>
            ) : null}
          </div>
        );
      })}

      <div>
        <Link className="text-sm text-blue-600 underline" href="/mock-exams">
          Back to mock exams
        </Link>
      </div>
    </section>
  );
}
