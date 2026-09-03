'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api-client';
import { Button, Card, SectionTitle } from '@/components/ui';
import { StudentShell } from '@/components/shells';
export default function PracticePage() { const router = useRouter(); const [busy, setBusy] = useState(false); const [error, setError] = useState<string | null>(null); async function start() { setBusy(true); try { const r = await api.startPractice({ totalQuestions: 5 }); router.push(`/practice/${r.session.id}`); } catch (e) { setError(e instanceof Error ? e.message : 'Unable to start practice'); setBusy(false); } } return <StudentShell><SectionTitle eyebrow="Focused practice" title="Five questions, useful feedback" description="Practice is for learning: hints are available, and every answer teaches you why." /><Card><p className="text-sm leading-6 text-slate-600">Choose a topic from Learn for a checkpoint, or start a mixed set. Your answers and mastery stay private to your account.</p>{error && <p role="alert" className="mt-4 text-sm text-rose-700">{error}</p>}<Button className="mt-5" onClick={start} disabled={busy}>{busy ? 'Preparing…' : 'Start 5-question set →'}</Button></Card></StudentShell>; }
