'use client';
import { learnerCopy, useLanguage } from '@/lib/language';
import { StudentShell } from '@/components/shells';
import { Card, ProgressBar, SectionTitle, Stat } from '@/components/ui';
export default function ProgressPage() {
  const copy = learnerCopy[useLanguage().language];
  const skills = [
    ['Grammar', '78%', 'bg-blue-600'],
    ['Vocabulary', '66%', 'bg-violet-500'],
    ['Reading', '71%', 'bg-emerald-500'],
    ['Listening', '54%', 'bg-amber-400'],
  ];
  return (
    <StudentShell>
      <SectionTitle
        eyebrow={copy.progress}
        title={copy.progressTitle}
        description={copy.progressDescription}
      />
      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label={copy.overallAccuracy} value="72%" detail="+8%" icon="↗" />
        <Stat label={copy.studyTime} value="8h 24m" detail={copy.thisMonth} icon="◷" />
        <Stat label={copy.sessions} value="18" detail={`4 ${copy.thisWeek}`} icon="✓" />
      </div>
      <Card className="mt-5">
        <h2 className="font-bold">{copy.skillBreakdown}</h2>
        <div className="mt-6 space-y-5">
          {skills.map(([name, value, color]) => (
            <div key={name}>
              <div className="mb-2 flex justify-between text-sm">
                <span className="font-semibold">{name}</span>
                <span className="text-slate-500">{value}</span>
              </div>
              <ProgressBar value={Number.parseInt(value)} color={color} />
            </div>
          ))}
        </div>
      </Card>
    </StudentShell>
  );
}
