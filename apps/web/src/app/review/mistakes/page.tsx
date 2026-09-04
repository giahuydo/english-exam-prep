'use client';
import { learnerCopy, useLanguage } from '@/lib/language';
import { StudentShell } from '@/components/shells';
import { EmptyState, SectionTitle } from '@/components/ui';
export default function ReviewMistakesPage() {
  const copy = learnerCopy[useLanguage().language];
  return (
    <StudentShell>
      <SectionTitle
        eyebrow={copy.reviewLabel}
        title={copy.notebookTitle}
        description={copy.notebookDescription}
      />
      <EmptyState
        title={copy.notebookClear}
        description={copy.notebookClearDescription}
        href="/practice"
        action={copy.startPracticeLabel}
      />
    </StudentShell>
  );
}
