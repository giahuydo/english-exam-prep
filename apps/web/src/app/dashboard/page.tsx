'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api-client';
import { learnerCopy, useLanguage } from '@/lib/language';
import { Badge, Button, Card, SectionTitle } from '@/components/ui';
import { StatusBadge, StudyCard } from '@/components/study';
import { StudentShell } from '@/components/shells';
interface DashboardData {
  profile: { name: string; currentExamType?: { name: string } | null };
  recentSessions: Array<{
    id: string;
    type: string;
    status: string;
    score: number;
    totalQuestions: number;
    correctCount: number;
  }>;
  weakTopics: Array<{
    topic: { id: string; code: string; name: string; category: string };
    accuracy: number;
    attemptCount: number;
  }>;
  mistakeCount: number;
}
export default function DashboardPage() {
  const copy = learnerCopy[useLanguage().language];
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    api
      .dashboard()
      .then((x) => setData(x as unknown as DashboardData))
      .catch((e) => setError(e instanceof Error ? e.message : copy.unableToday));
  }, [copy.unableToday]);
  if (error)
    return (
      <StudentShell>
        <Card>
          <p role="alert" className="text-rose-700">
            {error}
          </p>
          <Button className="mt-4" onClick={() => window.location.reload()}>
            {copy.tryAgain}
          </Button>
        </Card>
      </StudentShell>
    );
  if (!data)
    return (
      <StudentShell>
        <p className="text-slate-500">{copy.loadingToday}</p>
      </StudentShell>
    );
  const firstName = data.profile.name.split(' ')[0];
  const resume = data.recentSessions.find((s) => s.status === 'IN_PROGRESS');
  const last = data.recentSessions.find((s) => s.status !== 'IN_PROGRESS');
  return (
    <StudentShell>
      <SectionTitle
        eyebrow={copy.today}
        title={copy.goodMorning(firstName)}
        description={copy.todayDescription}
        action={
          <Badge tone="blue">
            {data.profile.currentExamType?.name ?? `${copy.examFramework} · ${copy.targetLevels}`}
          </Badge>
        }
      />
      <div className="grid gap-4 lg:grid-cols-2">
        <StudyCard
          eyebrow={copy.continueLearning}
          title={resume ? copy.pickUp : copy.buildWin}
          description={
            resume
              ? copy.questionsLeft(resume.totalQuestions - resume.correctCount)
              : copy.feedbackDescription
          }
          action={
            <Link
              className="inline-flex min-h-11 items-center rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white hover:bg-blue-700"
              href={resume ? `/practice/${resume.id}` : '/practice'}
            >
              {resume ? copy.resumePractice : copy.startQuestions}
            </Link>
          }
        />
        <StudyCard
          eyebrow={copy.needsReview}
          title={data.mistakeCount ? copy.questionsRevisit(data.mistakeCount) : copy.caughtUp}
          description={data.mistakeCount ? copy.reviewFresh : copy.caughtUpDescription}
          action={
            <Link
              className="inline-flex min-h-11 items-center rounded-xl border border-slate-300 px-5 text-sm font-semibold text-slate-800 hover:bg-slate-50"
              href={data.mistakeCount ? '/mistakes' : '/practice'}
            >
              {data.mistakeCount ? copy.practiceMistakes : copy.practiceNow}
            </Link>
          }
        />
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-[1.3fr_.7fr]">
        <StudyCard
          eyebrow={copy.examMode}
          title={copy.startResumeMock}
          description={copy.mockDescription}
          action={
            <Link
              className="inline-flex min-h-11 items-center rounded-xl bg-slate-950 px-5 text-sm font-semibold text-white hover:bg-slate-800"
              href="/mock-exams"
            >
              {resume?.type === 'MOCK_EXAM' ? copy.resumeMock : copy.chooseMock}
            </Link>
          }
        />
        <Card>
          <p className="text-xs font-bold uppercase tracking-[.16em] text-slate-400">
            {copy.recentProgress}
          </p>
          {last ? (
            <div className="mt-4">
              <p className="text-3xl font-bold text-slate-950">{Math.round(last.score * 100)}%</p>
              <p className="mt-1 text-sm text-slate-500">
                {last.correctCount} / {last.totalQuestions}
              </p>
              <Link
                className="mt-4 inline-block text-sm font-semibold text-blue-700"
                href={`/review?sessionId=${last.id}`}
              >
                {copy.reviewSession}
              </Link>
            </div>
          ) : (
            <p className="mt-4 text-sm text-slate-500">{copy.noCompleted}</p>
          )}
        </Card>
      </div>
      <div className="mt-4">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.16em] text-slate-400">
                {copy.focusAreas}
              </p>
              <h2 className="mt-2 text-lg font-bold">{copy.workNext}</h2>
            </div>
            <Link className="text-sm font-semibold text-blue-700" href="/learn">
              {copy.seeTopics}
            </Link>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {data.weakTopics.slice(0, 3).map((w) => (
              <Link
                key={w.topic.id}
                href={`/learn/${w.topic.code}`}
                className="rounded-xl border border-slate-200 p-4 hover:border-blue-300 hover:bg-blue-50/30"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold">{w.topic.name}</span>
                  <StatusBadge status={w.accuracy < 0.7 ? 'NEEDS_REVIEW' : 'IN_PROGRESS'} />
                </div>
                <p className="mt-2 text-sm text-slate-500">
                  {Math.round(w.accuracy * 100)}% · {copy.attempts(w.attemptCount)}
                </p>
              </Link>
            ))}
            {!data.weakTopics.length && <p className="text-sm text-slate-500">{copy.focusEmpty}</p>}
          </div>
        </Card>
      </div>
    </StudentShell>
  );
}
