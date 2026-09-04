'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api-client';
import { Button, Card, SectionTitle } from '@/components/ui';
import { StudentShell } from '@/components/shells';
import { learnerCopy, useLanguage } from '@/lib/language';
export default function PracticePage() {
  const copy = learnerCopy[useLanguage().language];
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  async function start() {
    setBusy(true);
    try {
      const r = await api.startPractice({ totalQuestions: 5 });
      router.push(`/practice/${r.session.id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : copy.unablePractice);
      setBusy(false);
    }
  }
  return (
    <StudentShell>
      <SectionTitle
        eyebrow={copy.focusedPractice}
        title={copy.startQuestions}
        description={copy.feedbackDescription}
      />
      <Card>
        <p className="text-sm leading-6 text-slate-600">{copy.mockDescription}</p>
        {error && (
          <p role="alert" className="mt-4 text-sm text-rose-700">
            {error}
          </p>
        )}
        <Button className="mt-5" onClick={start} disabled={busy}>
          {busy ? copy.preparing : copy.startPractice}
        </Button>
      </Card>
    </StudentShell>
  );
}
