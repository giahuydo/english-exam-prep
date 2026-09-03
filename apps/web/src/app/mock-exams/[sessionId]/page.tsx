'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api-client';

interface Option { id: string; optionKey: string; content: string }
interface Question { id: string; content: string; instruction?: string | null; options: Option[] }
interface SavedAnswer { questionId: string; selectedOptionId?: string | null; answerText?: string | null }
interface MockState { id: string; status: string; mockStatus: string; remainingSeconds: number | null; currentQuestionIndex: number; totalQuestions: number; questions: Array<{ question: Question }>; attempts: SavedAnswer[]; blueprint?: { name: string } | null }

export default function MockExamSessionPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const [state, setState] = useState<MockState | null>(null);
  const [position, setPosition] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [remaining, setRemaining] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      const next = (await api.getMockState(sessionId)) as MockState;
      setState(next); setPosition(next.currentQuestionIndex); setRemaining(next.remainingSeconds);
      setAnswers(Object.fromEntries(next.attempts.filter((a) => a.selectedOptionId).map((a) => [a.questionId, a.selectedOptionId!])));
    } catch (e) { setError(e instanceof Error ? e.message : 'Unable to load mock exam'); }
  }
  useEffect(() => { void load(); }, [sessionId]);
  useEffect(() => {
    if (remaining === null || state?.mockStatus !== 'RUNNING') return;
    const timer = window.setInterval(() => setRemaining((value) => value === null ? value : Math.max(0, value - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [state?.mockStatus, remaining === null]);
  const current = state?.questions[position]?.question;
  const formattedTime = useMemo(() => remaining === null ? '—' : `${Math.floor(remaining / 60).toString().padStart(2, '0')}:${(remaining % 60).toString().padStart(2, '0')}`, [remaining]);

  async function choose(optionId: string) {
    if (!current || state?.mockStatus === 'SUBMITTED' || state?.mockStatus === 'EXPIRED') return;
    setAnswers((a) => ({ ...a, [current.id]: optionId })); setSaving(true);
    try { await api.saveMockAnswer(sessionId, { questionId: current.id, selectedOptionId: optionId, currentQuestionIndex: position }); }
    catch (e) { setError(e instanceof Error ? e.message : 'Answer could not be saved'); }
    finally { setSaving(false); }
  }
  async function transition(action: 'pause' | 'resume') {
    try { const next = (action === 'pause' ? await api.pauseMock(sessionId) : await api.resumeMock(sessionId)) as MockState; setState((s) => s ? { ...s, ...next } : s); await load(); }
    catch (e) { setError(e instanceof Error ? e.message : 'Unable to change exam state'); }
  }
  async function submit() {
    if (!window.confirm('Submit this mock exam? You cannot change answers afterward.')) return;
    try { await api.submitMock(sessionId); window.location.href = `/review?sessionId=${sessionId}`; }
    catch (e) { setError(e instanceof Error ? e.message : 'Unable to submit mock exam'); }
  }
  if (error) return <p className="text-red-600">{error}</p>;
  if (!state) return <p>Loading mock exam…</p>;
  if (!current) return <p className="text-sm text-gray-500">No questions in this mock exam.</p>;

  const closed = state.mockStatus === 'SUBMITTED' || state.mockStatus === 'EXPIRED';
  return <section className="mx-auto grid max-w-3xl gap-4">
    <header className="flex items-center justify-between rounded border bg-white p-4">
      <div><h1 className="text-xl font-semibold">Mock Exam — {state.blueprint?.name ?? state.id.slice(0, 8)}</h1><p className="text-sm text-gray-600">Question {position + 1} / {state.questions.length} · {state.mockStatus}</p></div>
      <div className={`text-2xl font-bold ${remaining !== null && remaining < 60 ? 'text-red-600' : ''}`}>{formattedTime}</div>
    </header>
    {state.mockStatus === 'PAUSED' ? <div className="rounded border border-amber-300 bg-amber-50 p-4">Exam paused. Your answers are saved and the timer is stopped.<button className="ml-3 rounded bg-black px-3 py-1 text-sm text-white" onClick={() => transition('resume')}>Resume</button></div> : null}
    <div className="rounded border bg-white p-5"><p className="font-medium">{position + 1}. {current.content}</p>{current.instruction ? <p className="mt-1 text-xs text-gray-500">{current.instruction}</p> : null}<div className="mt-5 grid gap-2">{current.options.map((option) => <button key={option.id} disabled={closed || state.mockStatus === 'PAUSED' || saving} onClick={() => choose(option.id)} className={`rounded border px-3 py-3 text-left text-sm ${answers[current.id] === option.id ? 'border-blue-600 bg-blue-50' : 'hover:bg-gray-50'}`}><strong>{option.optionKey}.</strong> {option.content}</button>)}</div><p className="mt-3 text-xs text-gray-500">{saving ? 'Saving answer…' : answers[current.id] ? 'Answer saved' : 'Choose one answer'}</p></div>
    <nav className="flex items-center justify-between"><button className="rounded border px-3 py-2 text-sm" disabled={position === 0 || state.mockStatus === 'PAUSED'} onClick={() => setPosition((p) => p - 1)}>Previous</button><div className="flex gap-2">{!closed && state.mockStatus === 'RUNNING' ? <button className="rounded border px-3 py-2 text-sm" onClick={() => transition('pause')}>Pause & Exit</button> : null}{!closed && <button className="rounded bg-black px-3 py-2 text-sm text-white" onClick={submit}>Submit exam</button>}</div><button className="rounded border px-3 py-2 text-sm" disabled={position >= state.questions.length - 1 || state.mockStatus === 'PAUSED'} onClick={() => setPosition((p) => p + 1)}>Next</button></nav>
    <Link className="text-sm text-blue-600 underline" href="/mock-exams">Back to mock exams</Link>
  </section>;
}
