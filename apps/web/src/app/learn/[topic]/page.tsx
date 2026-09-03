'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api-client';
import { Badge, Button, Card, ProgressBar, SectionTitle } from '@/components/ui';
import { StudentShell } from '@/components/shells';
interface Scope { id: string; name: string; code: string; topic?: { name: string; category: string } | null }
export default function LearnTopicPage() {
  const params = useParams<{ topic: string }>(); const scopeId = params?.topic ?? ''; const router = useRouter(); const [scope, setScope] = useState<Scope | null>(null); const [error, setError] = useState(''); const [loading, setLoading] = useState(false);
  useEffect(() => { if (!scopeId) return; api.getLearningScopeLesson(scopeId).then((x) => setScope(x as Scope)).catch(() => setError('Unable to load topic')); }, [scopeId]);
  async function check() { if (!scopeId) return; setLoading(true); try { const r = await api.startLearningCheckpoint(scopeId); router.push(`/practice/${r.session.id}`); } catch { setError('Unable to start checkpoint'); setLoading(false); } }
  if (!scopeId) return <StudentShell><Card><p role="alert" className="text-rose-700">Missing topic route.</p></Card></StudentShell>; if (error) return <StudentShell><Card><p role="alert" className="text-rose-700">{error}</p></Card></StudentShell>; if (!scope) return <StudentShell><p className="text-slate-500">Loading lesson…</p></StudentShell>;
  const title = scope.topic?.name ?? scope.name; const category = scope.topic?.category ?? 'Learning scope'; return <StudentShell><SectionTitle eyebrow={category} title={title} description="Learn the pattern, check your understanding, then keep going." action={<Badge tone="blue">Focused lesson</Badge>} /><div className="grid gap-5 lg:grid-cols-[1.3fr_.7fr]"><Card><p className="text-xs font-bold uppercase tracking-widest text-blue-600">1 · Learn</p><h2 className="mt-3 text-xl font-bold">Build a clear mental model</h2><p className="mt-4 leading-7 text-slate-600">{scope.name}: start with the structure, notice the signal words, and read the whole sentence before choosing an answer.</p><div className="mt-5 rounded-xl bg-slate-50 p-5 font-mono text-sm text-slate-700">subject + verb + complement</div><h3 className="mt-6 font-bold">Remember</h3><ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600"><li>Look for the signal in the sentence.</li><li>Check agreement and meaning together.</li><li>Read the complete sentence again.</li></ul></Card><Card><p className="text-xs font-bold uppercase tracking-widest text-blue-600">2 · Check</p><h2 className="mt-3 text-xl font-bold">Five-question checkpoint</h2><p className="mt-3 text-sm leading-6 text-slate-500">Your result will tell you whether to continue or review this lesson.</p><ProgressBar value={0} /><Button className="mt-6 w-full" onClick={check} disabled={loading}>{loading ? 'Preparing…' : 'Check 5 questions →'}</Button></Card></div></StudentShell>;
}
