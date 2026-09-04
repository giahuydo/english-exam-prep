'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api-client';
import { AdaptiveReviewPanel } from '@/components/adaptive-review';
import { readAnswerSignals, type AnswerSignal } from '@/lib/adaptive-review';
import { Card, SectionTitle } from '@/components/ui';
import { StudentShell } from '@/components/shells';

interface Mistake { id: string; createdAt: string; question: { content: string; level?: string; questionType?: { name: string } | null; topics?: Array<{ topic: { name: string } }> } }
export default function ReviewPage() {
  const [mistakes, setMistakes] = useState<Mistake[]>([]); const [signals, setSignals] = useState<AnswerSignal[]>([]); const [error, setError] = useState<string | null>(null);
  useEffect(() => { setSignals(readAnswerSignals()); api.myMistakes().then((rows) => setMistakes((rows as Mistake[]).slice(0, 8))).catch((e) => setError(e instanceof Error ? e.message : 'Unable to load review')); }, []);
  return <StudentShell><SectionTitle eyebrow="VSTEP B1/B2 review" title="Review what matters next" description="Prioritize recent mistakes, low-confidence correct answers, and recurring skill patterns — not random practice." />{error && <Card><p role="alert" className="text-rose-700">{error}</p></Card>}<div className="grid gap-5 lg:grid-cols-[1.2fr_.8fr]"><AdaptiveReviewPanel signals={signals} /><Card><p className="text-xs font-bold uppercase tracking-widest text-blue-600">Mistake patterns</p><h2 className="mt-2 text-lg font-bold">Recent VSTEP B1/B2 gaps</h2>{mistakes.length ? <div className="mt-4 space-y-3">{mistakes.map((mistake) => <div key={mistake.id} className="rounded-xl border border-slate-100 p-3"><p className="text-sm font-semibold">{mistake.question.content}</p><p className="mt-1 text-xs text-slate-500">{mistake.question.level ?? 'B1/B2'} · {mistake.question.questionType?.name ?? 'Question'}{mistake.question.topics?.[0]?.topic ? ` · ${mistake.question.topics[0].topic.name}` : ''}</p></div>)}</div> : <p className="mt-4 text-sm text-slate-500">No mistakes yet. Complete a practice set to create a focused queue.</p>}<Link className="mt-4 inline-block text-sm font-semibold text-blue-700" href="/mistakes">See mistake notebook →</Link></Card></div><Card className="mt-5"><p className="text-xs font-bold uppercase tracking-widest text-slate-400">Review rhythm</p><div className="mt-4 grid gap-3 sm:grid-cols-4">{[['Today', 'Mistakes + guesses'], ['1d', 'Unsure answers'], ['3d', 'Correct, reinforced'], ['7d', 'Strong recall check']].map(([when, label]) => <div key={when} className="rounded-xl bg-slate-50 p-4"><p className="font-bold text-slate-900">{when}</p><p className="mt-1 text-xs leading-5 text-slate-500">{label}</p></div>)}</div><p className="mt-4 text-xs text-slate-400">Suggested intervals are a lightweight planning aid, not a guarantee of retention.</p></Card></StudentShell>;
}
