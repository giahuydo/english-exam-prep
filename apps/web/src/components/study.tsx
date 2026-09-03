'use client';

import type { ReactNode } from 'react';
import { Badge, Button, Card, ProgressBar } from './ui';

export type LearningStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'PASSED' | 'NEEDS_REVIEW';

export function StatusBadge({ status }: { status: LearningStatus }) {
  const tone = status === 'PASSED' ? 'green' : status === 'NEEDS_REVIEW' ? 'rose' : status === 'IN_PROGRESS' ? 'blue' : 'slate';
  return <Badge tone={tone}>{status.replaceAll('_', ' ')}</Badge>;
}

export function StudyCard({ title, description, action, eyebrow, children, className = '' }: { title: string; description?: string; action?: ReactNode; eyebrow?: string; children?: ReactNode; className?: string }) {
  return <Card className={`flex flex-col ${className}`}>
    {eyebrow && <p className="text-xs font-bold uppercase tracking-[.16em] text-blue-600">{eyebrow}</p>}
    <h2 className="mt-2 text-lg font-bold text-slate-950">{title}</h2>
    {description && <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>}
    {children}
    {action && <div className="mt-5">{action}</div>}
  </Card>;
}

export function AnswerOption({ optionKey, content, selected, disabled, onClick }: { optionKey: string; content: string; selected: boolean; disabled?: boolean; onClick: () => void }) {
  return <button type="button" aria-pressed={selected} disabled={disabled} onClick={onClick} className={`flex min-h-16 w-full items-start gap-3 rounded-2xl border-2 p-4 text-left text-base leading-6 transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${selected ? 'border-blue-600 bg-blue-50 text-slate-950' : 'border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/40'} disabled:cursor-default`}>
    <span className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold ${selected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}>{optionKey}</span>
    <span>{content}</span>
  </button>;
}

export function ProgressHeader({ current, total, label = 'Question progress' }: { current: number; total: number; label?: string }) {
  return <div aria-label={`${label}: ${current} of ${total}`}><div className="mb-2 flex justify-between text-sm"><span className="font-semibold text-slate-700">{label}</span><span className="text-slate-500">{current} / {total}</span></div><ProgressBar value={(current / Math.max(total, 1)) * 100} /></div>;
}

export function FeedbackPanel({ correct, explanation, wrongOptionExplanations }: { correct: boolean | null; explanation?: string | null; wrongOptionExplanations?: Array<{ optionId: string; explanation: string | null }> }) {
  return <div role="status" className={`mt-6 rounded-2xl border p-5 ${correct ? 'border-emerald-200 bg-emerald-50' : 'border-rose-200 bg-rose-50'}`}>
    <p className={`text-lg font-bold ${correct ? 'text-emerald-800' : 'text-rose-800'}`}>{correct ? 'Correct — nice work.' : 'Not quite — let’s learn from it.'}</p>
    {explanation && <div className="mt-4 grid gap-4 text-sm leading-6"><div><p className="font-bold text-slate-800">Why</p><p className="text-slate-700">{explanation}</p></div><div><p className="font-bold text-slate-800">Rule / structure</p><p className="text-slate-700">Look for the signal in the sentence, then check the complete structure before choosing.</p></div>{!correct && <div><p className="font-bold text-slate-800">Common mistake</p><p className="text-slate-700">Choosing a familiar-looking answer before checking meaning and grammar together.</p></div>}<div><p className="font-bold text-slate-800">Example</p><p className="text-slate-700">Read the sentence again with your choice inserted. Does the whole sentence sound and mean what the question asks?</p></div></div>}
    {wrongOptionExplanations?.some((x) => x.explanation) && <div className="mt-4 border-t border-slate-200/70 pt-4"><p className="font-bold text-slate-800">Why other answers do not work</p><ul className="mt-2 space-y-1 text-sm text-slate-700">{wrongOptionExplanations.filter((x) => x.explanation).map((x) => <li key={x.optionId}>{x.explanation}</li>)}</ul></div>}
  </div>;
}
