'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api-client';
import { learnerCopy, useLanguage } from '@/lib/language';
import { Badge, Button, Card, ProgressBar, SectionTitle } from '@/components/ui';
import { StudentShell } from '@/components/shells';
import { SignalBadges } from '@/components/study';
interface ScopeLesson {
  rule?: string;
  examples?: string[];
  commonMistakes?: string[];
}
interface Scope {
  id: string;
  name: string;
  code: string;
  lesson?: ScopeLesson | null;
  topic?: { name: string; category: string } | null;
}
export default function LearnTopicPage() {
  const copy = learnerCopy[useLanguage().language];
  const params = useParams<{ topic: string }>();
  const scopeId = params?.topic ?? '';
  const router = useRouter();
  const [scope, setScope] = useState<Scope | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (!scopeId) return;
    api
      .getLearningScopeLesson(scopeId)
      .then((x) => setScope(x as Scope))
      .catch(() => setError(copy.unableTopic));
  }, [copy.unableTopic, scopeId]);
  async function check() {
    if (!scopeId) return;
    setLoading(true);
    try {
      const r = await api.startLearningCheckpoint(scopeId);
      router.push(`/practice/${r.session.id}`);
    } catch {
      setError(copy.unableCheckpoint);
      setLoading(false);
    }
  }
  if (!scopeId)
    return (
      <StudentShell>
        <Card>
          <p role="alert" className="text-rose-700">
            {copy.missingTopic}
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
  if (!scope)
    return (
      <StudentShell>
        <p className="text-slate-500">{copy.loading}</p>
      </StudentShell>
    );
  const title = scope.name;
  const category = scope.topic?.name ?? copy.learningScope;
  const lesson = scope.lesson ?? {};
  return (
    <StudentShell>
      <SectionTitle
        eyebrow={category}
        title={title}
        description={copy.lessonDescription}
        action={<Badge tone="blue">{copy.focusedLesson}</Badge>}
      />
      <div className="grid gap-5 lg:grid-cols-[1.3fr_.7fr]">
        <Card>
          <p className="text-xs font-bold uppercase tracking-widest text-blue-600">
            {copy.learnStep}
          </p>
          <h2 className="mt-3 text-xl font-bold">{copy.mentalModel}</h2>
          <p className="mt-4 leading-7 text-slate-600">
            {lesson.rule ?? copy.lessonFallback(scope.name)}
          </p>
          <SignalBadges />
          {lesson.examples?.length ? (
            <div className="mt-5 space-y-2 rounded-xl bg-slate-50 p-5 font-mono text-sm text-slate-700">
              {lesson.examples.map((example) => (
                <p key={example}>{example}</p>
              ))}
            </div>
          ) : (
            <div className="mt-5 rounded-xl bg-slate-50 p-5 font-mono text-sm text-slate-700">
              subject + verb + complement
            </div>
          )}
          <h3 className="mt-6 font-bold">{copy.remember}</h3>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
            {lesson.commonMistakes?.length ? (
              lesson.commonMistakes.map((mistake) => (
                <li key={mistake}>
                  {copy.check}: {mistake}
                </li>
              ))
            ) : (
              <>
                <li>{copy.signalSentence}</li>
                <li>{copy.agreementMeaning}</li>
                <li>{copy.completeSentence}</li>
              </>
            )}
          </ul>
        </Card>
        <Card>
          <p className="text-xs font-bold uppercase tracking-widest text-blue-600">
            {copy.checkStep}
          </p>
          <h2 className="mt-3 text-xl font-bold">{copy.fiveCheckpoint}</h2>
          <p className="mt-3 text-sm leading-6 text-slate-500">{copy.checkpointDescription}</p>
          <ProgressBar value={0} />
          <Button className="mt-6 w-full" onClick={check} disabled={loading}>
            {loading ? copy.preparing : copy.checkQuestions}
          </Button>
        </Card>
      </div>
    </StudentShell>
  );
}
