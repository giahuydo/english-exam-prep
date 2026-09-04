'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api-client';
import { Button, Card, SectionTitle } from '@/components/ui';
import {
  FeedbackPanel,
  LearningAnswerTiles,
  ProgressHeader,
  ShadowingMode,
  SignalBadges,
} from '@/components/study';
import { StudentShell } from '@/components/shells';
import { learnerCopy, useLanguage } from '@/lib/language';
interface QuestionOption {
  id: string;
  optionKey: string;
  content: string;
}
interface Question {
  id: string;
  content: string;
  instruction?: string | null;
  context?: string | null;
  options: QuestionOption[];
  level?: string | null;
  topics?: Array<{ topic: { id: string; name: string; code?: string; category?: string } }>;
  hint1?: string | null;
  hint2?: string | null;
  hint3?: string | null;
  questionType?: { code?: string; name?: string } | null;
}
interface Result {
  attemptId: string;
  isCorrect: boolean | null;
  correctOptionId?: string | null;
  correctOptionKey?: string | null;
  explanation: string | null;
  ruleStructure?: string | null;
  commonMistake?: string | null;
  example?: string | null;
  wrongOptionExplanations: Array<{
    optionId: string;
    optionKey: string;
    explanation: string | null;
  }>;
  hintLevelUsed: number;
}
interface Session {
  id: string;
  status: string;
  score: number;
  correctCount: number;
  totalQuestions: number;
  questions?: Array<{ question: Question }>;
}
export default function PracticeSessionPage() {
  const params = useParams<{ sessionId: string }>();
  const sessionId = params?.sessionId ?? '';
  const router = useRouter();
  const { language } = useLanguage();
  const copy = learnerCopy[language];
  const [session, setSession] = useState<Session | null>(null);
  const [showPassage, setShowPassage] = useState(true);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | undefined>();
  const [result, setResult] = useState<Result | null>(null);
  const [hintLevel, setHintLevel] = useState(0);
  const [hintText, setHintText] = useState<string[]>([]);
  const [confidence, setConfidence] = useState<'KNOW' | 'UNSURE' | 'GUESS'>('UNSURE');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    if (!sessionId) return;
    api
      .getPracticeSession(sessionId)
      .then((s) => setSession(s as Session))
      .catch((e) => setError(e instanceof Error ? e.message : copy.unablePractice));
  }, [copy.unablePractice, sessionId]);
  const questions = session?.questions?.map((x) => x.question) ?? [];
  const q = questions[index];
  const kind = q?.questionType?.code?.toLowerCase().includes('vocab')
    ? 'vocabulary'
    : q?.questionType?.code?.toLowerCase().includes('read')
      ? 'reading'
      : q?.questionType?.code?.toLowerCase().includes('speak') ||
          q?.questionType?.code?.toLowerCase().includes('listen')
        ? 'speaking'
        : 'grammar';
  async function submit() {
    if (!q || !selected || !sessionId) return;
    setBusy(true);
    try {
      const answer = await api.submitAnswer(sessionId, {
          questionId: q.id,
          selectedOptionId: selected,
          hintLevelUsed: hintLevel,
          language,
        });
      setResult(answer);
      await api.recordLearningMemory(q.id, { correct: answer.isCorrect === true, confidence, errorTag: answer.isCorrect ? null : 'answer-error' });
    } catch (e) {
      setError(e instanceof Error ? e.message : copy.unableSubmit);
    } finally {
      setBusy(false);
    }
  }
  async function hint() {
    if (!q || !sessionId || hintLevel >= 3) return;
    const next = (hintLevel + 1) as 1 | 2 | 3;
    setBusy(true);
    try {
      const r = await api.revealHint(sessionId, q.id, next);
      if (r.hint) setHintText((x) => [...x, r.hint!]);
      setHintLevel(next);
    } catch (e) {
      setError(e instanceof Error ? e.message : copy.unableHint);
    } finally {
      setBusy(false);
    }
  }
  function next() {
    setSelected(undefined);
    setResult(null);
    setHintLevel(0);
    setHintText([]);
    setIndex((x) => x + 1);
  }
  if (!sessionId)
    return (
      <StudentShell>
        <Card>
          <p role="alert" className="text-rose-700">
            {copy.missingPractice}
          </p>
        </Card>
      </StudentShell>
    );
  if (error)
    return (
      <StudentShell>
        <Card>
          <p role="alert" className="text-rose-700">
            {error}
          </p>
        </Card>
      </StudentShell>
    );
  if (!session)
    return (
      <StudentShell>
        <p className="text-slate-500">{copy.loading}</p>
      </StudentShell>
    );
  if (!q)
    return (
      <StudentShell>
        <Card>
          <SectionTitle
            eyebrow={copy.practiceComplete}
            title={copy.niceWork}
            description={copy.reviewDescription}
          />
          <Button onClick={() => router.push(`/review?sessionId=${session.id}`)}>
            {copy.reviewAnswers}
          </Button>
        </Card>
      </StudentShell>
    );
  return (
    <StudentShell>
      <SectionTitle
        eyebrow={copy.focusedPractice}
        title={copy.learnAsAnswer}
        description={copy.practiceDescription}
        action={
          <Link className="text-sm font-semibold text-slate-500" href="/dashboard">
            {copy.exitPractice}
          </Link>
        }
      />
      <div className="mx-auto max-w-5xl">
        <ProgressHeader
          current={index + 1}
          total={questions.length}
          label={copy.questionProgress}
        />
        {q.context && (
          <div className="mt-4 flex gap-2 md:hidden">
            <Button
              type="button"
              className={showPassage ? 'bg-slate-900' : 'bg-white text-slate-700 shadow-none'}
              onClick={() => setShowPassage(true)}
            >
              {copy.passage}
            </Button>
            <Button
              type="button"
              className={!showPassage ? 'bg-slate-900' : 'bg-white text-slate-700 shadow-none'}
              onClick={() => setShowPassage(false)}
            >
              {copy.question}
            </Button>
          </div>
        )}
        <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4"><p className="text-sm font-bold text-slate-800">{copy.confidenceLabel}</p><div className="mt-3 flex flex-wrap gap-2">{(['KNOW', 'UNSURE', 'GUESS'] as const).map((item) => <button key={item} type="button" onClick={() => setConfidence(item)} className={`rounded-xl border px-3 py-2 text-sm font-semibold ${confidence === item ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-200 bg-white text-slate-700'}`}>{item === 'KNOW' ? copy.confidenceKnow : item === 'UNSURE' ? copy.confidenceUnsure : copy.confidenceGuess}</button>)}</div></div>
        <div className={`mt-6 grid gap-5 ${q.context ? 'lg:grid-cols-[3fr_2fr]' : ''}`}>
          <Card className={`p-6 sm:p-9 ${q.context && !showPassage ? 'hidden md:block' : ''}`}>
            {q.context && (
              <>
                <p className="text-xs font-bold uppercase tracking-widest text-blue-600">
                  {copy.passage}
                </p>
                <div className="mt-4 text-base leading-8 text-slate-700">{q.context}</div>
              </>
            )}
            {!q.context && q.instruction && (
              <p className="text-sm italic text-slate-500">{q.instruction}</p>
            )}
          </Card>
          <Card className={`p-6 sm:p-9 ${q.context && showPassage ? 'hidden md:block' : ''}`}>
            {q.context && q.instruction && (
              <p className="text-sm italic text-slate-500">{q.instruction}</p>
            )}
            <h2 className="mt-5 text-xl font-bold leading-8 text-slate-950 sm:text-2xl">
              {q.content}
            </h2>
            <SignalBadges kind={kind} />
            <div className="mt-7">
              <LearningAnswerTiles
                options={q.options}
                selected={selected}
                disabled={!!result}
                onSelect={setSelected}
                kind={kind}
              />
            </div>
            {kind === 'speaking' && <ShadowingMode text={q.content} />}
            {!result && (
              <div className="mt-7 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-5">
                <Button
                  type="button"
                  className="bg-amber-50 text-amber-900 shadow-none hover:bg-amber-100"
                  disabled={busy || hintLevel >= 3 || !q[`hint${hintLevel + 1}` as 'hint1']}
                  onClick={hint}
                >
                  {hintLevel ? copy.revealHint(hintLevel + 1) : copy.needHint}
                </Button>
                <Button onClick={submit} disabled={busy || !selected}>
                  {busy ? copy.checking : copy.submitAnswer}
                </Button>
              </div>
            )}
            {hintText.map((text, i) => (
              <p
                key={`${text}-${i}`}
                className="mt-3 rounded-xl bg-amber-50 p-3 text-sm leading-6 text-amber-900"
              >
                {copy.hint(i + 1)}: {text}
              </p>
            ))}
            {result && (
              <>
                <FeedbackPanel
                  correct={result.isCorrect}
                  explanation={result.explanation}
                  ruleStructure={result.ruleStructure}
                  commonMistake={result.commonMistake}
                  example={result.example}
                  wrongOptionExplanations={result.wrongOptionExplanations}
                />
                <div className="mt-5 flex justify-end">
                  <Button onClick={next}>
                    {index + 1 === questions.length ? copy.result : copy.next}
                  </Button>
                </div>
              </>
            )}
          </Card>
        </div>
      </div>
    </StudentShell>
  );
}
