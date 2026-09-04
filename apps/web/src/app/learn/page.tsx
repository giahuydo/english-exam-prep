'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api-client';
import { Badge, Card, EmptyState, SectionTitle } from '@/components/ui';
import { StatusBadge, type LearningStatus } from '@/components/study';
import { StudentShell } from '@/components/shells';
import { useLanguage, learnerCopy } from '@/lib/language';

interface Topic {
  id: string;
  code: string;
  name: string;
  category: string;
}
interface ExamTarget { id: string; code: string; name: string; }
interface Me { currentExamTypeId?: string | null; currentExamType?: ExamTarget | null; }
interface ScopeProgress { status: LearningStatus; lastScore?: number | null; attemptCount: number; }
interface Scope {
  id: string;
  name: string;
  code: string;
  topicId: string;
  position: number;
  parent?: { id: string; code: string; name: string } | null;
  topic?: Topic | null;
  progress?: ScopeProgress[];
}

function statusFor(scopes: Scope[]): LearningStatus {
  if (!scopes.length) return 'NOT_STARTED';
  const progress = scopes.map((scope) => scope.progress?.[0]).filter(Boolean) as ScopeProgress[];
  if (progress.some((item) => item.status === 'NEEDS_REVIEW')) return 'NEEDS_REVIEW';
  if (progress.length > 0 && progress.every((item) => item.status === 'PASSED')) return 'PASSED';
  if (progress.some((item) => item.status === 'IN_PROGRESS' || item.status === 'PASSED')) return 'IN_PROGRESS';
  return 'NOT_STARTED';
}

export default function LearnPage() {
  const { language } = useLanguage();
  const copy = learnerCopy[language];
  const [scopes, setScopes] = useState<Scope[]>([]);
  const [me, setMe] = useState<Me | null>(null);
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    api.listLearningScopes()
      .then((scopeRows) => {
        if (active) setScopes(scopeRows as Scope[]);
      })
      .catch((reason) => {
        if (active) setError(reason instanceof Error ? reason.message : 'Unable to load learning topics');
      })
      .finally(() => { if (active) setLoading(false); });
    api.me()
      .then((profile) => { if (active) setMe(profile as Me); })
      .catch(() => undefined);
    return () => { active = false; };
  }, []);

  const topics = useMemo(() => {
    const byId = new Map<string, Topic>();
    for (const scope of scopes) {
      if (scope.topic) byId.set(scope.topic.id, scope.topic);
    }
    return [...byId.values()].sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name));
  }, [scopes]);
  const selectedTopic = topics.find((topic) => topic.id === selectedTopicId) ?? null;
  const selectedScopes = scopes.filter((scope) => scope.topicId === selectedTopicId).sort((a, b) => a.position - b.position || a.name.localeCompare(b.name));
  const target = me?.currentExamType;
  const targetCategory = target?.code === 'VSTEP' ? 'READING' : target?.code === 'HCMUS_MASTER_ENTRANCE' ? 'GRAMMAR' : undefined;
  const orderedTopics = targetCategory ? [...topics].sort((a, b) => Number(b.category === targetCategory) - Number(a.category === targetCategory)) : topics;

  return <StudentShell>
    <SectionTitle
      eyebrow="Learning path"
      title="Choose a topic to begin"
      description="Start with the area you want to improve. Then choose a focused skill, read the lesson, and take its checkpoint."
      action={<div className="flex flex-wrap items-center gap-3">{target && <Badge tone="blue">Target: {target.name}</Badge>}<Link className="text-sm font-semibold text-blue-700" href="/exam-map">Remember exam shape →</Link></div>}
    />
    {loading ? <div className="grid gap-4 sm:grid-cols-2"><Card><div className="h-5 w-2/3 animate-pulse rounded bg-slate-100" /><div className="mt-3 h-4 w-full animate-pulse rounded bg-slate-100" /></Card><Card><div className="h-5 w-1/2 animate-pulse rounded bg-slate-100" /><div className="mt-3 h-4 w-full animate-pulse rounded bg-slate-100" /></Card></div>
      : error ? <Card><p role="alert" className="text-rose-700">{error}</p><p className="mt-2 text-sm text-slate-500">Please refresh and try again.</p></Card>
      : !topics.length ? <EmptyState title="No learning topics yet" description="Your learning library has not been published yet. Check back soon." />
      : <>
        <div id="topics" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-label="Learning topics">
          {orderedTopics.map((topic) => {
            const topicScopes = scopes.filter((scope) => scope.topicId === topic.id);
            const selected = selectedTopicId === topic.id;
            return <button key={topic.id} type="button" onClick={() => setSelectedTopicId(topic.id)} aria-pressed={selected} className={`rounded-2xl border bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md ${selected ? 'border-blue-600 ring-2 ring-blue-100' : 'border-slate-200'}`}>
              <div className="flex items-start justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-blue-600">{topic.category}</p><h2 className="mt-2 text-lg font-bold text-slate-950">{topic.name}</h2></div><StatusBadge status={statusFor(topicScopes)} /></div>
              <p className="mt-3 text-sm text-slate-500">{topicScopes.length} {topicScopes.length === 1 ? 'learning skill' : 'learning skills'} available</p>
              <p className="mt-4 text-sm font-semibold text-blue-700">{selected ? 'Selected ✓' : 'View skills →'}</p>
            </button>;
          })}
        </div>
        {selectedTopic && <section className="mt-8" aria-labelledby="skills-heading">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-blue-600">{selectedTopic.category}</p><h2 id="skills-heading" className="mt-1 text-xl font-bold text-slate-950">{selectedTopic.name} skills</h2><p className="mt-1 text-sm text-slate-500">Choose one focused scope. Each lesson ends with a five-question checkpoint.</p></div><Link href="#topics" className="text-sm font-semibold text-slate-500 hover:text-blue-700">Change topic</Link></div>
          {!selectedScopes.length ? <EmptyState title="No skills in this topic yet" description="This topic is ready for content, but no learning scopes have been published." /> : <div className="grid gap-3">{selectedScopes.map((scope, index) => { const progress = scope.progress?.[0]; const status = progress?.status ?? 'NOT_STARTED'; return <Card key={scope.id} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-start gap-4"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-sm font-bold text-blue-700">{index + 1}</span><div><h3 className="font-bold text-slate-950">{scope.name}</h3><p className="mt-1 text-sm text-slate-500">{scope.parent ? `Part of ${scope.parent.name}` : 'Focused learning skill'}{progress?.attemptCount ? ` · ${progress.attemptCount} checkpoint${progress.attemptCount === 1 ? '' : 's'}` : ''}</p></div></div><div className="flex items-center gap-3"><StatusBadge status={status} /><Link href={`/learn/${scope.id}`} className="inline-flex min-h-10 items-center rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white hover:bg-blue-700">{status === 'NOT_STARTED' ? 'Learn →' : status === 'NEEDS_REVIEW' ? 'Review →' : 'Continue →'}</Link></div></Card>; })}</div>}
        </section>}
      </>}
  </StudentShell>;
}
