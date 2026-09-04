'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api-client';
import { Badge, Button, Card, SectionTitle } from '@/components/ui';
import { StudentShell } from '@/components/shells';
import { learnerCopy, useLanguage } from '@/lib/language';
interface ExamType {
  id: string;
  code: string;
  name: string;
}
interface Blueprint {
  id: string;
  name: string;
  version: string;
  examType: ExamType;
  items?: Array<{ questionCount?: number | null; weight?: number | null }>;
}
export default function MockExamsPage() {
  const copy = learnerCopy[useLanguage().language];
  const router = useRouter();
  const [blueprints, setBlueprints] = useState<Blueprint[]>([]);
  const [examTypes, setExamTypes] = useState<ExamType[]>([]);
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    Promise.all([api.listBlueprints(), api.listExamTypes()])
      .then(([b, e]) => {
        setBlueprints(b as Blueprint[]);
        setExamTypes(e as ExamType[]);
      })
      .catch((x) => setError(x instanceof Error ? x.message : copy.unablePractice));
  }, [copy.unablePractice]);
  async function start(b: Blueprint) {
    setLoading(b.id);
    try {
      const r = await api.startMockExam({
        examTypeId: b.examType.id,
        blueprintId: b.id,
        totalQuestions: 40,
      });
      router.push(`/mock-exams/${r.session.id}`);
    } catch (x) {
      setError(x instanceof Error ? x.message : copy.unablePractice);
      setLoading(null);
    }
  }
  return (
    <StudentShell>
      <SectionTitle
        eyebrow={copy.assessmentMode}
        title={copy.mockExams}
        description={copy.mockListDescription}
      />
      {error && (
        <Card className="mb-4">
          <p role="alert" className="text-rose-700">
            {error}
          </p>
        </Card>
      )}
      {!blueprints.length ? (
        <Card>
          <p className="text-sm text-slate-500">{copy.noBlueprints}</p>
          {examTypes.length > 0 && (
            <p className="mt-2 text-xs text-slate-400">{copy.publishBlueprint}</p>
          )}
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {blueprints.map((b) => (
            <Card key={b.id} className="border-slate-300">
              <Badge tone="blue">
                {copy.examFramework} · {copy.targetLevels}
              </Badge>
              <h2 className="mt-4 text-xl font-bold">{b.name}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                {copy.versionTiming(b.version)}
              </p>
              <div className="mt-6 flex justify-between text-sm text-slate-500">
                <span>
                  {copy.questions(b.items?.reduce((n, i) => n + (i.questionCount ?? 0), 0) || 40)}
                </span>
                <span>{copy.timed}</span>
              </div>
              <Button
                className="mt-5 bg-slate-950 hover:bg-slate-800"
                onClick={() => start(b)}
                disabled={loading === b.id}
              >
                {loading === b.id ? copy.preparing : copy.beginMock}
              </Button>
            </Card>
          ))}
        </div>
      )}
    </StudentShell>
  );
}
