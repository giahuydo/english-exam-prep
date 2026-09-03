'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api-client';
import { Badge, Button, Card, SectionTitle } from '@/components/ui';
import { StatusBadge, StudyCard } from '@/components/study';
import { StudentShell } from '@/components/shells';

interface DashboardData {
  profile: { name: string; currentExamType?: { name: string } | null };
  recentSessions: Array<{ id: string; type: string; status: string; score: number; totalQuestions: number; correctCount: number }>;
  weakTopics: Array<{ topic: { id: string; code: string; name: string; category: string }; accuracy: number; attemptCount: number }>;
  mistakeCount: number;
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => { api.dashboard().then((x) => setData(x as unknown as DashboardData)).catch((e) => setError(e instanceof Error ? e.message : 'Unable to load today')); }, []);
  if (error) return <StudentShell><Card><p role="alert" className="text-rose-700">{error}</p><Button className="mt-4" onClick={() => window.location.reload()}>Try again</Button></Card></StudentShell>;
  if (!data) return <StudentShell><p className="text-slate-500">Loading today’s study plan…</p></StudentShell>;
  const firstName = data.profile.name.split(' ')[0];
  const resume = data.recentSessions.find((s) => s.status === 'IN_PROGRESS');
  const last = data.recentSessions.find((s) => s.status !== 'IN_PROGRESS');
  return <StudentShell><SectionTitle eyebrow="Today" title={`Good morning, ${firstName}.`} description="Choose one focused next step. You do not need to do everything today." action={<Badge tone="blue">{data.profile.currentExamType?.name ?? 'English exam prep'}</Badge>} />
    <div className="grid gap-4 lg:grid-cols-2">
      <StudyCard eyebrow="Continue learning" title={resume ? 'Pick up your unfinished session' : 'Build your next win'} description={resume ? `You have ${resume.totalQuestions - resume.correctCount} questions left in this session.` : 'Start a short focused set and get teaching feedback after every answer.'} action={<Link className="inline-flex min-h-11 items-center rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white hover:bg-blue-700" href={resume ? `/practice/${resume.id}` : '/practice'}>{resume ? 'Resume practice →' : 'Start 5 questions →'}</Link>} />
      <StudyCard eyebrow="Needs review" title={data.mistakeCount ? `${data.mistakeCount} question${data.mistakeCount === 1 ? '' : 's'} to revisit` : 'You are all caught up'} description={data.mistakeCount ? 'Review mistakes while the reasoning is still fresh.' : 'Complete a practice set and this space will guide your next review.'} action={<Link className="inline-flex min-h-11 items-center rounded-xl border border-slate-300 px-5 text-sm font-semibold text-slate-800 hover:bg-slate-50" href={data.mistakeCount ? '/mistakes' : '/practice'}>{data.mistakeCount ? 'Practice mistakes →' : 'Practice now →'}</Link>} />
    </div>
    <div className="mt-4 grid gap-4 lg:grid-cols-[1.3fr_.7fr]">
      <StudyCard eyebrow="Exam mode" title="Start or resume a mock exam" description="A timed, distraction-free simulation. No hints or explanations until you submit." action={<Link className="inline-flex min-h-11 items-center rounded-xl bg-slate-950 px-5 text-sm font-semibold text-white hover:bg-slate-800" href="/mock-exams">{resume?.type === 'MOCK_EXAM' ? 'Resume mock exam →' : 'Choose a mock exam →'}</Link>} />
      <Card><p className="text-xs font-bold uppercase tracking-[.16em] text-slate-400">Recent progress</p>{last ? <div className="mt-4"><p className="text-3xl font-bold text-slate-950">{Math.round(last.score * 100)}%</p><p className="mt-1 text-sm text-slate-500">{last.correctCount} of {last.totalQuestions} in {last.type.replaceAll('_', ' ').toLowerCase()}</p><Link className="mt-4 inline-block text-sm font-semibold text-blue-700" href={`/review?sessionId=${last.id}`}>Review this session →</Link></div> : <p className="mt-4 text-sm text-slate-500">No completed sessions yet. Your first result will appear here.</p>}</Card>
    </div>
    <div className="mt-4"><Card><div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-slate-400">Focus areas</p><h2 className="mt-2 text-lg font-bold">What to work on next</h2></div><Link className="text-sm font-semibold text-blue-700" href="/learn">See all topics →</Link></div><div className="mt-4 grid gap-3 sm:grid-cols-3">{data.weakTopics.slice(0, 3).map((w) => <Link key={w.topic.id} href={`/learn/${w.topic.code}`} className="rounded-xl border border-slate-200 p-4 hover:border-blue-300 hover:bg-blue-50/30"><div className="flex items-center justify-between gap-2"><span className="font-semibold">{w.topic.name}</span><StatusBadge status={w.accuracy < .7 ? 'NEEDS_REVIEW' : 'IN_PROGRESS'} /></div><p className="mt-2 text-sm text-slate-500">{Math.round(w.accuracy * 100)}% accuracy · {w.attemptCount} attempts</p></Link>)}{!data.weakTopics.length && <p className="text-sm text-slate-500">Your focus areas will appear after you answer some questions.</p>}</div></Card></div>
  </StudentShell>;
}
