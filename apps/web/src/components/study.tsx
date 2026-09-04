'use client';

import { useState, type ReactNode } from 'react';
import { Badge, Card, ProgressBar } from './ui';
import { learnerCopy, useLanguage } from '@/lib/language';

export type LearningStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'PASSED' | 'NEEDS_REVIEW';

export function StatusBadge({ status }: { status: LearningStatus }) {
  const tone =
    status === 'PASSED'
      ? 'green'
      : status === 'NEEDS_REVIEW'
        ? 'rose'
        : status === 'IN_PROGRESS'
          ? 'blue'
          : 'slate';
  return <Badge tone={tone}>{status.replaceAll('_', ' ')}</Badge>;
}

export function StudyCard({
  title,
  description,
  action,
  eyebrow,
  children,
  className = '',
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  eyebrow?: string;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <Card className={`flex flex-col ${className}`}>
      {eyebrow && (
        <p className="text-xs font-bold uppercase tracking-[.16em] text-blue-600">{eyebrow}</p>
      )}
      <h2 className="mt-2 text-lg font-bold text-slate-950">{title}</h2>
      {description && <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>}
      {children}
      {action && <div className="mt-5">{action}</div>}
    </Card>
  );
}

export function AnswerOption({
  optionKey,
  content,
  selected,
  disabled,
  onClick,
}: {
  optionKey: string;
  content: string;
  selected: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      disabled={disabled}
      onClick={onClick}
      className={`flex min-h-16 w-full items-start gap-3 rounded-2xl border-2 p-4 text-left text-base leading-6 transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${selected ? 'border-blue-600 bg-blue-50 text-slate-950' : 'border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/40'} disabled:cursor-default`}
    >
      <span
        className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold ${selected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}
      >
        {optionKey}
      </span>
      <span>{content}</span>
    </button>
  );
}

export function LearningAnswerTiles({
  options,
  selected,
  disabled,
  onSelect,
  kind = 'grammar',
}: {
  options: Array<{ id: string; optionKey: string; content: string }>;
  selected?: string;
  disabled?: boolean;
  onSelect: (id: string) => void;
  kind?: 'grammar' | 'vocabulary' | 'reading' | 'speaking';
}) {
  const copy = learnerCopy[useLanguage().language];
  const labels =
    kind === 'vocabulary'
      ? [copy.meaning, copy.bestFit, copy.contextLabel]
      : kind === 'reading'
        ? [copy.evidence, copy.mainIdea, copy.detail]
        : kind === 'speaking'
          ? [copy.naturalSound, copy.meaning, copy.grammar]
          : [copy.structure, copy.signal, copy.meaning];
  return (
    <div className="grid gap-3 sm:grid-cols-2" aria-label={copy.answerChoices}>
      {options.map((option, index) => (
        <button
          key={option.id}
          type="button"
          aria-pressed={selected === option.id}
          disabled={disabled}
          onClick={() => onSelect(option.id)}
          className={`group rounded-2xl border-2 p-4 text-left transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${selected === option.id ? 'border-blue-600 bg-blue-50 shadow-sm' : 'border-slate-200 bg-white hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-sm'} disabled:cursor-default`}
        >
          <div className="flex items-center justify-between">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-sm font-bold text-slate-600 group-hover:bg-blue-100 group-hover:text-blue-700">
              {option.optionKey}
            </span>
            <span className="rounded-full bg-slate-50 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-400">
              {labels[index % labels.length]}
            </span>
          </div>
          <p className="mt-4 text-base font-semibold leading-6 text-slate-900">{option.content}</p>
          <p className="mt-2 text-xs text-slate-500">{copy.tileHelper}</p>
        </button>
      ))}
    </div>
  );
}

export function SignalBadges({
  kind = 'grammar',
}: {
  kind?: 'grammar' | 'vocabulary' | 'reading' | 'speaking';
}) {
  const copy = learnerCopy[useLanguage().language];
  const badges =
    kind === 'vocabulary'
      ? [copy.collocation, copy.wordFamily, copy.contrast]
      : kind === 'reading'
        ? [copy.evidence, copy.keySentence, copy.inference]
        : kind === 'speaking'
          ? [copy.stress, copy.chunk, copy.shadow]
          : [copy.signalWord, copy.structure, copy.agreement];
  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {badges.map((badge) => (
        <span
          key={badge}
          className="rounded-full border border-blue-100 bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-700"
        >
          {badge}
        </span>
      ))}
    </div>
  );
}

export function ShadowingMode({ text }: { text: string }) {
  const copy = learnerCopy[useLanguage().language];
  const [active, setActive] = useState(false);
  const chunks = text.split(/(?<=[,.!?])\\s+|\\s+(?=to\\b)/i).filter(Boolean);
  function play() {
    setActive(true);
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onend = () => setActive(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setActive(false), Math.max(1200, chunks.length * 700));
    }
  }
  return (
    <div className="mt-5 rounded-2xl border border-violet-100 bg-violet-50/50 p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-violet-950">{copy.shadowingMode}</p>
          <p className="mt-1 text-xs text-violet-700">{copy.shadowingHelper}</p>
        </div>
        <button
          type="button"
          onClick={play}
          className="rounded-xl bg-violet-600 px-3 py-2 text-xs font-bold text-white"
        >
          {active ? copy.playing : copy.readAloud}
        </button>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {chunks.map((chunk, index) => (
          <span
            key={`${chunk}-${index}`}
            className={`rounded-lg px-2 py-1 text-sm ${active ? 'bg-white text-violet-900' : 'bg-violet-100 text-violet-800'}`}
          >
            {chunk}
          </span>
        ))}
      </div>
    </div>
  );
}

export function ProgressHeader({
  current,
  total,
  label,
}: {
  current: number;
  total: number;
  label?: string;
}) {
  return (
    <div aria-label={`${label}: ${current} of ${total}`}>
      <div className="mb-2 flex justify-between text-sm">
        <span className="font-semibold text-slate-700">{label}</span>
        <span className="text-slate-500">
          {current} / {total}
        </span>
      </div>
      <ProgressBar value={(current / Math.max(total, 1)) * 100} />
    </div>
  );
}

export function FeedbackPanel({
  correct,
  explanation,
  ruleStructure,
  commonMistake,
  example,
  wrongOptionExplanations,
}: {
  correct: boolean | null;
  explanation?: string | null;
  ruleStructure?: string | null;
  commonMistake?: string | null;
  example?: string | null;
  wrongOptionExplanations?: Array<{
    optionId: string;
    optionKey?: string;
    explanation: string | null;
  }>;
}) {
  const { language } = useLanguage();
  const copy = learnerCopy[language];
  const sections = [
    { label: copy.why, value: explanation, icon: '◎' },
    { label: copy.rule, value: ruleStructure, icon: '⌁' },
    { label: copy.example, value: example, icon: '↗' },
    ...(!correct ? [{ label: copy.commonMistake, value: commonMistake, icon: '!' }] : []),
  ].filter((section) => Boolean(section.value));
  return (
    <div
      role="status"
      className={`mt-6 overflow-hidden rounded-2xl border ${correct ? 'border-emerald-200' : 'border-rose-200'}`}
    >
      <div
        className={`flex items-center gap-3 px-5 py-4 ${correct ? 'bg-emerald-50' : 'bg-rose-50'}`}
      >
        <span
          className={`flex h-9 w-9 items-center justify-center rounded-full text-lg font-bold ${correct ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'}`}
        >
          {correct ? '✓' : '!'}
        </span>
        <div>
          <p className={`text-base font-bold ${correct ? 'text-emerald-800' : 'text-rose-800'}`}>
            {correct ? copy.correct : copy.incorrect}
          </p>
          <p className="text-sm text-slate-600">{correct ? copy.niceWork : copy.review}</p>
        </div>
      </div>
      {sections.length > 0 && (
        <div className="grid gap-3 bg-white p-4 sm:grid-cols-2">
          {sections.map((section) => (
            <div
              key={section.label}
              className="rounded-xl border border-slate-100 bg-slate-50/70 p-4"
            >
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-500">
                <span className="text-base text-blue-600">{section.icon}</span>
                {section.label}
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-700">{section.value}</p>
            </div>
          ))}
        </div>
      )}
      {wrongOptionExplanations?.some((x) => x.explanation) && (
        <div className="border-t border-slate-100 bg-white p-4">
          <p className="text-sm font-bold text-slate-800">{copy.otherAnswers}</p>
          <div className="mt-3 grid gap-2">
            {wrongOptionExplanations
              .filter((x) => x.explanation)
              .map((x) => (
                <div
                  key={x.optionId}
                  className="flex gap-3 rounded-xl bg-rose-50/60 p-3 text-sm leading-6 text-slate-700"
                >
                  <span className="font-bold text-rose-700">{x.optionKey ?? '•'}</span>
                  <span>{x.explanation}</span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
