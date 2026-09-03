'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api-client';

interface QuestionDetail {
  id: string;
  content: string;
  instruction?: string | null;
  level: string;
  difficulty: string;
  status: string;
  hint1?: string | null;
  hint2?: string | null;
  hint3?: string | null;
  explanation?: string | null;
  questionType?: { id: string; code: string; name: string; category: string };
  topics?: Array<{
    isPrimary: boolean;
    topic: { id: string; code: string; name: string; category: string; parentId: string | null };
  }>;
  options?: Array<{
    id: string;
    optionKey: string;
    content: string;
    isCorrect: boolean;
    explanation?: string | null;
  }>;
}

export default function AdminQuestionEditor({ params }: { params: { id: string } }) {
  const [q, setQ] = useState<QuestionDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .getQuestion(params.id)
      .then((data) => setQ(data as QuestionDetail))
      .catch((e) => setError(e instanceof Error ? e.message : 'load failed'));
  }, [params.id]);

  if (error) return <p className="text-red-600">{error}</p>;
  if (!q) return <p>Loading...</p>;

  const primaryTopic = q.topics?.find((t) => t.isPrimary)?.topic;
  const secondaryTopics = q.topics?.filter((t) => !t.isPrimary).map((t) => t.topic) ?? [];

  return (
    <section className="grid gap-6">
      <h1 className="text-xl font-semibold">Edit Question</h1>

      <div className="grid grid-cols-1 gap-4 rounded border bg-white p-4 md:grid-cols-2">
        <Field label="Question Type" value={`${q.questionType?.name ?? '-'} (${q.questionType?.code ?? '-'})`} />
        <Field label="Level" value={q.level} />
        <Field label="Difficulty" value={q.difficulty} />
        <Field label="Status" value={q.status} />
        <Field label="Primary Topic" value={primaryTopic ? `${primaryTopic.name} (${primaryTopic.code})` : '-'} />
        <Field
          label="Subtopics"
          value={secondaryTopics.length ? secondaryTopics.map((t) => t.name).join(', ') : '-'}
        />
      </div>

      <div className="rounded border bg-white p-4">
        <h2 className="font-semibold">Content</h2>
        <p className="mt-2 whitespace-pre-wrap">{q.content}</p>
        {q.instruction ? (
          <p className="mt-2 text-sm text-gray-600">Instruction: {q.instruction}</p>
        ) : null}
      </div>

      <div className="rounded border bg-white p-4">
        <h2 className="font-semibold">Options</h2>
        <ul className="mt-2 space-y-2">
          {(q.options ?? []).map((o) => (
            <li key={o.id} className="rounded border px-2 py-1">
              <div className={o.isCorrect ? 'text-green-700' : ''}>
                <strong>{o.optionKey}.</strong> {o.content} {o.isCorrect ? '(correct)' : ''}
              </div>
              {!o.isCorrect && o.explanation ? (
                <p className="mt-1 text-xs text-red-700">
                  Wrong-option explanation: {o.explanation}
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded border bg-white p-4">
        <h2 className="font-semibold">Main explanation</h2>
        {q.explanation ? (
          <p className="mt-2 whitespace-pre-wrap text-sm text-gray-800">{q.explanation}</p>
        ) : (
          <p className="mt-2 text-sm text-gray-500">No explanation set.</p>
        )}
      </div>

      <div className="rounded border bg-white p-4">
        <h2 className="font-semibold">Hints (progressive)</h2>
        <ol className="mt-2 space-y-2 text-sm">
          {[1, 2, 3].map((lv) => {
            const text = (q as unknown as Record<string, string | null>)[`hint${lv}`];
            return (
              <li key={lv} className="rounded border px-2 py-1">
                <div className="text-xs uppercase tracking-wide text-gray-500">
                  Hint {lv}
                </div>
                {text ? (
                  <p className="mt-1 whitespace-pre-wrap">{text}</p>
                ) : (
                  <p className="mt-1 text-gray-400">Not set.</p>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wide text-gray-500">{label}</div>
      <div className="mt-1 rounded bg-gray-50 px-2 py-1 text-sm">{value}</div>
    </div>
  );
}
