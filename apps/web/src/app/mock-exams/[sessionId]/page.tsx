'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api-client';
import { Badge, Button, Card, SectionTitle } from '@/components/ui';
import { AnswerOption, ProgressHeader } from '@/components/study';
import { StudentShell } from '@/components/shells';

interface Option {
  id: string;
  optionKey: string;
  content: string;
}

interface Question {
  id: string;
  content: string;
  instruction?: string | null;
  context?: string | null;
  options: Option[];
}

interface Attempt {
  questionId: string;
  selectedOptionId?: string | null;
  answerText?: string | null;
}

interface MockState {
  id: string;
  status: string;
  mockStatus?: 'NOT_STARTED' | 'RUNNING' | 'PAUSED' | 'SUBMITTED' | 'EXPIRED' | null;
  remainingSeconds: number | null;
  currentQuestionIndex: number;
  score: number;
  correctCount: number;
  totalQuestions: number;
  blueprint?: { name: string; version: string } | null;
  attempts?: Attempt[];
  questions?: Array<{ question: Question }>;
}

function formatTime(seconds: number | null) {
  if (seconds === null) return '—';
  return `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
}

export default function MockExamSessionPage() {
  const params = useParams<{ sessionId: string }>();
  const sessionId = params?.sessionId ?? '';
  const router = useRouter();
  const [session, setSession] = useState<MockState | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [index, setIndex] = useState(0);
  const [seconds, setSeconds] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [savingQuestionId, setSavingQuestionId] = useState<string | null>(null);

  const applyState = useCallback((next: MockState) => {
    setSession(next);
    setSeconds(next.remainingSeconds);
    setIndex(Math.max(0, next.currentQuestionIndex ?? 0));
    setAnswers(
      Object.fromEntries(
        (next.attempts ?? [])
          .filter((attempt) => attempt.selectedOptionId)
          .map((attempt) => [attempt.questionId, attempt.selectedOptionId as string]),
      ),
    );
  }, []);

  const load = useCallback(async () => {
    if (!sessionId) return;
    const next = (await api.getMockState(sessionId)) as MockState;
    applyState(next);
  }, [applyState, sessionId]);

  useEffect(() => {
    if (!sessionId) return;
    load().catch((e) => setError(e instanceof Error ? e.message : 'Unable to load mock exam'));
  }, [load, sessionId]);

  const lifecycle = session?.mockStatus ?? (session?.status === 'COMPLETED' ? 'SUBMITTED' : session?.status);
  const isActive = lifecycle === 'RUNNING' || lifecycle === 'PAUSED';
  const questions = session?.questions?.map((item) => item.question) ?? [];
  const question = questions[index];
  const answered = Object.keys(answers).length;

  useEffect(() => {
    if (!sessionId || lifecycle !== 'RUNNING' || seconds === null) return;
    const timer = window.setInterval(() => {
      setSeconds((current) => {
        if (current === null || current <= 1) {
          window.clearInterval(timer);
          void load().catch((e) => setError(e instanceof Error ? e.message : 'Unable to refresh mock exam state'));
          return 0;
        }
        return current - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [lifecycle, load, seconds, sessionId]);

  const saveAnswer = useCallback(
    async (questionId: string, selectedOptionId: string) => {
      if (!sessionId || !isActive) return;
      setSavingQuestionId(questionId);
      try {
        await api.saveMockAnswer(sessionId, {
          questionId,
          selectedOptionId,
          currentQuestionIndex: index,
        });
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Unable to save answer');
        setAnswers((current) => {
          const next = { ...current };
          delete next[questionId];
          return next;
        });
      } finally {
        setSavingQuestionId(null);
      }
    },
    [index, isActive, sessionId],
  );

  function choose(questionId: string, optionId: string) {
    if (!isActive || seconds === 0) return;
    setAnswers((current) => ({ ...current, [questionId]: optionId }));
    void saveAnswer(questionId, optionId);
  }

  async function goToQuestion(nextIndex: number) {
    if (nextIndex === index || nextIndex < 0 || nextIndex >= questions.length) return;
    if (question && answers[question.id] && isActive) {
      try {
        await api.saveMockAnswer(sessionId, {
          questionId: question.id,
          selectedOptionId: answers[question.id],
          currentQuestionIndex: nextIndex,
        });
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Unable to save question position');
        return;
      }
    }
    setIndex(nextIndex);
  }

  async function pauseAndExit() {
    if (!sessionId || lifecycle !== 'RUNNING') {
      router.push('/mock-exams');
      return;
    }
    setBusy(true);
    try {
      if (question && answers[question.id]) {
        await api.saveMockAnswer(sessionId, {
          questionId: question.id,
          selectedOptionId: answers[question.id],
          currentQuestionIndex: index,
        });
      }
      await api.pauseMock(sessionId);
      router.push('/mock-exams');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unable to pause mock exam');
      setBusy(false);
    }
  }

  async function resume() {
    if (!sessionId || lifecycle !== 'PAUSED') return;
    setBusy(true);
    try {
      const resumed = (await api.resumeMock(sessionId)) as MockState;
      await load();
      setSession((current) => (current ? { ...current, ...resumed, mockStatus: 'RUNNING' } : resumed));
      setSeconds(resumed.remainingSeconds ?? seconds);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unable to resume mock exam');
    } finally {
      setBusy(false);
    }
  }

  async function submit() {
    if (!sessionId || !isActive) return;
    setBusy(true);
    try {
      await api.submitMock(sessionId);
      router.push(`/review?sessionId=${sessionId}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unable to submit mock exam');
      setBusy(false);
    }
  }

  const terminalCopy = useMemo(() => {
    if (lifecycle === 'EXPIRED') return { title: 'Mock exam expired', description: 'The server timer reached zero. Your saved answers are available for review.' };
    if (lifecycle === 'SUBMITTED') return { title: 'Mock exam submitted', description: 'Your mock exam has already been submitted. Review the score and answers.' };
    return null;
  }, [lifecycle]);

  if (!sessionId) return <StudentShell><Card><p role="alert" className="text-rose-700">Missing mock exam route.</p></Card></StudentShell>;
  if (error) return <StudentShell><Card><p role="alert" className="text-rose-700">{error}</p><Button className="mt-4" onClick={() => { setError(null); void load(); }}>Retry</Button></Card></StudentShell>;
  if (!session) return <StudentShell><p className="text-slate-500">Loading mock exam…</p></StudentShell>;

  if (terminalCopy) {
    return <StudentShell><Card><Badge tone={lifecycle === 'EXPIRED' ? 'amber' : 'green'}>{lifecycle}</Badge><SectionTitle eyebrow="Mock exam complete" title={terminalCopy.title} description={terminalCopy.description} /><Button onClick={() => router.push(`/review?sessionId=${sessionId}`)}>Review result →</Button></Card></StudentShell>;
  }

  if (lifecycle === 'PAUSED') {
    return <StudentShell><Card><Badge tone="amber">PAUSED</Badge><SectionTitle eyebrow="Mock exam saved" title="Ready to resume?" description="Your answers, position, and server-authoritative time are saved." /><div className="flex flex-wrap gap-3"><Button onClick={resume} disabled={busy}>{busy ? 'Resuming…' : 'Resume mock exam →'}</Button><Button className="bg-white text-slate-700 shadow-none hover:bg-slate-50" onClick={() => router.push('/mock-exams')}>Back to mock exams</Button></div></Card></StudentShell>;
  }

  if (!question) return <StudentShell><Card><SectionTitle eyebrow="Mock exam" title="No questions available" description="This mock exam has no questions to display." /><Button onClick={() => router.push('/mock-exams')}>Back to mock exams</Button></Card></StudentShell>;

  return <StudentShell>
    <div className="rounded-2xl bg-slate-950 p-5 text-white sm:p-7">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div><p className="text-xs font-bold uppercase tracking-[.16em] text-blue-300">Mock exam mode</p><h1 className="mt-2 text-2xl font-bold">{session.blueprint?.name ?? 'Exam simulation'}</h1><p className="mt-1 text-sm text-slate-300">No hints or explanations until final submission.</p></div>
        <div className="text-right"><p className="text-xs uppercase tracking-widest text-slate-400">Server time remaining</p><p className="mt-1 font-mono text-2xl font-bold" aria-live="polite">{formatTime(seconds)}</p><p className="mt-1 text-xs text-slate-400">{lifecycle}</p></div>
      </div>
      <div className="mt-6"><ProgressHeader current={index + 1} total={questions.length} label={`Answered ${answered} of ${questions.length}`} /></div>
    </div>

    <div className="mx-auto mt-5 grid max-w-5xl gap-5 lg:grid-cols-[1fr_220px]">
      <Card className="p-6 sm:p-9">
        <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Question {index + 1}</p>
        {question.instruction && <p className="mt-4 text-sm italic text-slate-500">{question.instruction}</p>}
        {question.context && <div className="mt-4 rounded-xl bg-slate-50 p-4 text-sm leading-7 text-slate-700">{question.context}</div>}
        <h2 className="mt-5 text-xl font-bold leading-8 sm:text-2xl">{question.content}</h2>
        <div className="mt-7 grid gap-3">{question.options.map((option) => <AnswerOption key={option.id} optionKey={option.optionKey} content={option.content} selected={answers[question.id] === option.id} disabled={savingQuestionId === question.id || seconds === 0} onClick={() => choose(question.id, option.id)} />)}</div>
        <p className="mt-3 min-h-5 text-xs text-slate-500" aria-live="polite">{savingQuestionId === question.id ? 'Saving answer…' : answers[question.id] ? 'Answer saved' : 'Choose an answer to save it.'}</p>
        <div className="mt-5 flex flex-wrap justify-between gap-3 border-t border-slate-100 pt-5"><Button className="border border-slate-200 bg-white text-slate-700 shadow-none hover:bg-slate-50" onClick={() => void goToQuestion(index - 1)} disabled={index === 0 || busy}>← Previous</Button>{index < questions.length - 1 ? <Button onClick={() => void goToQuestion(index + 1)} disabled={busy}>Next →</Button> : <Button className="bg-slate-950 hover:bg-slate-800" onClick={submit} disabled={busy}>{busy ? 'Submitting…' : 'Submit mock exam'}</Button>}</div>
      </Card>

      <Card><p className="text-sm font-bold">Question navigator</p><div className="mt-4 grid grid-cols-5 gap-2">{questions.map((item, questionIndex) => <button key={item.id} type="button" aria-label={`Go to question ${questionIndex + 1}`} onClick={() => void goToQuestion(questionIndex)} className={`h-9 rounded-lg border text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 ${questionIndex === index ? 'border-blue-600 bg-blue-600 text-white' : answers[item.id] ? 'border-emerald-300 bg-emerald-50 text-emerald-800' : 'border-slate-200 text-slate-600'}`}>{questionIndex + 1}</button>)}</div><p className="mt-4 text-xs leading-5 text-slate-500">Green numbers have an answer. You can change answers before submitting.</p><div className="mt-6 grid gap-2"><Button className="bg-amber-600 hover:bg-amber-700" onClick={pauseAndExit} disabled={busy}>{busy ? 'Saving…' : 'Pause & exit'}</Button><Link className="text-center text-sm font-semibold text-slate-600 hover:text-slate-950" href="/mock-exams">Cancel</Link></div></Card>
    </div>
  </StudentShell>;
}
