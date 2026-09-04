'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Badge, Button, Card, SectionTitle } from '@/components/ui';
import { StudentShell } from '@/components/shells';
import { learnerCopy, useLanguage } from '@/lib/language';
import { api } from '@/lib/api-client';

type Word = {
  word: string;
  meaning: string;
  pos: string;
  ipa?: string;
  example: string;
  synonyms: string[];
  antonyms: string[];
  collocations: string[];
  family: string[];
  related: string[];
};
const words: Word[] = [
  {
    word: 'maintain',
    meaning: 'giữ vững; duy trì',
    pos: 'verb',
    ipa: '/meɪnˈteɪn/',
    example: 'Regular review helps maintain a strong memory.',
    synonyms: ['preserve', 'sustain'],
    antonyms: ['abandon', 'neglect'],
    collocations: ['maintain focus', 'maintain standards'],
    family: ['maintenance', 'maintained'],
    related: ['sustain', 'preserve'],
  },
  {
    word: 'sustain',
    meaning: 'duy trì; làm cho tiếp tục',
    pos: 'verb',
    ipa: '/səˈsteɪn/',
    example: 'Small habits sustain progress over time.',
    synonyms: ['maintain', 'support'],
    antonyms: ['undermine'],
    collocations: ['sustain progress', 'sustain growth'],
    family: ['sustainable', 'sustainability'],
    related: ['maintain', 'support'],
  },
  {
    word: 'evidence',
    meaning: 'bằng chứng',
    pos: 'noun',
    ipa: '/ˈevɪdəns/',
    example: 'Use evidence from the passage to support your answer.',
    synonyms: ['proof', 'indication'],
    antonyms: ['doubt'],
    collocations: ['strong evidence', 'evidence suggests'],
    family: ['evident', 'evidently'],
    related: ['proof', 'indication'],
  },
  {
    word: 'accurate',
    meaning: 'chính xác',
    pos: 'adjective',
    ipa: '/ˈækjərət/',
    example: 'An accurate answer fits both grammar and meaning.',
    synonyms: ['correct', 'precise'],
    antonyms: ['inaccurate'],
    collocations: ['highly accurate', 'accurate information'],
    family: ['accuracy', 'accurately'],
    related: ['precise', 'correct'],
  },
];
const categories = [
  { name: 'Academic habits', words: ['maintain', 'sustain'] },
  { name: 'Reading evidence', words: ['evidence', 'accurate'] },
];

export default function VocabularyPage() {
  const { language } = useLanguage();
  const copy = learnerCopy[language];
  const [selected, setSelected] = useState('maintain');
  const [revealed, setRevealed] = useState(false);
  const [confidence, setConfidence] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const word = useMemo(() => words.find((item) => item.word === selected) ?? words[0], [selected]);
  function open(next: string) {
    if (words.some((item) => item.word === next)) {
      setSelected(next);
      setRevealed(false);
      setConfidence(null);
    }
  }
  return (
    <StudentShell>
      <SectionTitle
        eyebrow="Memory vocabulary"
        title={copy.vocabularyTitle}
        description={copy.vocabularyDescription}
        action={<Badge tone="blue">{copy.prototype}</Badge>}
      />
      <div className="grid gap-5 lg:grid-cols-[.8fr_1.2fr]">
        <div className="grid gap-4">
          {categories.map((category) => (
            <Card key={category.name}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-blue-600">
                    {copy.cluster}
                  </p>
                  <h2 className="mt-1 font-bold text-slate-950">{category.name}</h2>
                </div>
                <span className="text-xs text-slate-400">{copy.words(category.words.length)}</span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {category.words.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => open(item)}
                    className={`rounded-xl border px-3 py-2 text-sm font-semibold transition ${selected === item ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-blue-300'}`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </Card>
          ))}
        </div>
        <Card className="p-6 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-blue-600">
                {copy.wordCard}
              </p>
              <h2 className="mt-2 text-3xl font-bold text-slate-950">{word.word}</h2>
              <p className="mt-1 text-sm italic text-slate-500">
                {word.ipa} · {word.pos}
              </p>
            </div>
            <Badge tone={revealed ? 'green' : 'amber'}>
              {revealed ? copy.meaningRevealed : copy.recallFirst}
            </Badge>
          </div>
          <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50/50 p-5">
            <p className="text-sm font-semibold text-blue-900">
              {revealed ? word.meaning : copy.sayMeaning}
            </p>
            {revealed && <p className="mt-3 text-base leading-7 text-slate-800">{word.example}</p>}
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            <Button onClick={() => setRevealed(true)} disabled={revealed}>
              {revealed ? copy.meaningShown : copy.revealMeaning}
            </Button>
            {['Know', 'Unsure', 'Guess'].map((item) => (
              <button
                key={item}
                type="button"
                onClick={async () => { setConfidence(item); setSaving(true); try { await api.recordVocabularyMemory(word.word, item.toUpperCase() as 'KNOW' | 'UNSURE' | 'GUESS'); } finally { setSaving(false); } }}
                className={`rounded-xl border px-3 py-2 text-sm font-semibold ${confidence === item ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-200 bg-white text-slate-700'}`}
              >
                {item}
              </button>
            ))}
          </div>
          {revealed && (
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Relation label={copy.synonyms} items={word.synonyms} onOpen={open} tone="green" />
              <Relation label={copy.antonyms} items={word.antonyms} onOpen={open} tone="rose" />
              <Relation
                label={copy.collocations}
                items={word.collocations}
                onOpen={() => undefined}
                tone="blue"
              />
              <Relation
                label={copy.wordFamily}
                items={word.family}
                onOpen={() => undefined}
                tone="amber"
              />
              <Relation label={copy.relatedWords} items={word.related} onOpen={open} tone="slate" />
            </div>
          )}
          {revealed && (
            <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
              <span className="text-sm text-slate-500">
                {saving ? 'Saving…' : confidence ? copy.marked(confidence) : copy.markConfidence}
              </span>
              <div className="flex gap-2">
                <Link
                  href="/vocabulary"
                  className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700"
                >
                  {copy.again}
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    const i = words.findIndex((item) => item.word === word.word);
                    open(words[(i + 1) % words.length].word);
                  }}
                  className="rounded-xl bg-slate-950 px-3 py-2 text-sm font-semibold text-white"
                >
                  {copy.nextWord}
                </button>
              </div>
            </div>
          )}
        </Card>
      </div>
      <p className="mt-4 text-xs text-slate-400">{copy.vocabularyPrototypeNote}</p>
    </StudentShell>
  );
}
function Relation({
  label,
  items,
  onOpen,
  tone,
}: {
  label: string;
  items: string[];
  onOpen: (word: string) => void;
  tone: 'green' | 'rose' | 'blue' | 'amber' | 'slate';
}) {
  const tones = {
    green: 'bg-emerald-50',
    rose: 'bg-rose-50',
    blue: 'bg-blue-50',
    amber: 'bg-amber-50',
    slate: 'bg-slate-50',
  };
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">{label}</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {items.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => onOpen(item)}
            className={`rounded-full ${tones[tone]} px-2.5 py-1 text-xs font-semibold text-slate-700 hover:ring-2 hover:ring-blue-200`}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}
