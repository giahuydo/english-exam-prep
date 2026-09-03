'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api-client';

interface QuestionOption {
  id: string;
  optionKey: string;
  content: string;
  isCorrect: boolean;
}
interface PracticeQuestion {
  id: string;
  content: string;
  options: QuestionOption[];
}

export default function PracticePage() {
  const [questions, setQuestions] = useState<PracticeQuestion[]>([]);
  const [chosen, setChosen] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .startPractice(5)
      .then((res) => setQuestions(res.questions as PracticeQuestion[]))
      .catch((e) => setError(e instanceof Error ? e.message : 'start failed'));
  }, []);

  if (error) return <p className="text-red-600">{error}</p>;
  if (questions.length === 0)
    return <p className="text-sm text-gray-600">No published questions yet. Seed some via admin.</p>;

  return (
    <section className="grid gap-6">
      <h1 className="text-xl font-semibold">Practice</h1>
      {questions.map((q, idx) => {
        const picked = chosen[q.id];
        const pickedOpt = q.options.find((o) => o.id === picked);
        return (
          <div key={q.id} className="rounded border bg-white p-4">
            <p className="font-medium">
              {idx + 1}. {q.content}
            </p>
            <ul className="mt-2 grid gap-1">
              {q.options.map((o) => (
                <li key={o.id}>
                  <button
                    className={`w-full rounded border px-2 py-1 text-left text-sm ${
                      picked === o.id
                        ? o.isCorrect
                          ? 'border-green-600 bg-green-50'
                          : 'border-red-600 bg-red-50'
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setChosen((c) => ({ ...c, [q.id]: o.id }))}
                  >
                    <strong>{o.optionKey}.</strong> {o.content}
                  </button>
                </li>
              ))}
            </ul>
            {pickedOpt ? (
              <p className={`mt-2 text-sm ${pickedOpt.isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                {pickedOpt.isCorrect ? 'Correct!' : 'Not quite.'}
              </p>
            ) : null}
          </div>
        );
      })}
    </section>
  );
}
