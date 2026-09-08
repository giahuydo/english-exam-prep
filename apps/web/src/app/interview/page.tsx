'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { buildSpeechMapping, useInterviewAudio, type AudioRange, type AudioSpeed, type SpeechMapping } from './audio';
import {
  finalMindset,
  gapFormula,
  interviewIntro,
  interviewQuestions,
  reusableStories,
  selectionFlow,
  strategyRows,
  type InterviewQuestion,
} from './data';
import { RichText } from './rich-text';
import { clozeText, parseInlineRanges, questionStarters, stripFormatting } from './utils';
import { getContextsForQuestion } from './connections';
import { useProgress, type LearningLevel, type ReviewDifficulty } from './storage';
import { contexts, phraseClusters, heroStories, triggers, getQuestionsForContext, getQuestionsForCluster, getQuestionsForStory, getContextsForTrigger, getMemoryNodes, questionLabel, type Context, type MemoryNode } from './connections';

type Mode = 'recall' | 'learn' | 'quick' | 'connections';
type Filter = 'all' | 'practiced' | 'difficult' | 'due';

const levelLabels: Record<LearningLevel, string> = { 1: 'Full', 2: 'Guided', 3: 'Keywords', 4: 'Map', 5: 'Interview' };
const reviewLabels: Record<ReviewDifficulty, string> = { again: 'Again', hard: 'Hard', good: 'Good', easy: 'Easy' };

export default function InterviewPage() {
  const progress = useProgress();
  const { practiced, difficult, isDue } = progress;
  const [mode, setMode] = useState<Mode>('recall');
  const [filter, setFilter] = useState<Filter>('all');
  const [activeId, setActiveId] = useState(20);
  const [quickOrder, setQuickOrder] = useState<number[]>(() => shuffle(interviewQuestions.map((q) => q.id)));
  const [quickIndex, setQuickIndex] = useState(0);
  const [showStrategy, setShowStrategy] = useState(false);
  const [selectedContext, setSelectedContext] = useState<Context | null>(null);

  const available = useMemo(() => interviewQuestions.filter((q) => {
    if (filter === 'practiced') return practiced.has(q.id);
    if (filter === 'difficult') return difficult.has(q.id);
    if (filter === 'due') return isDue(q.id);
    return true;
  }), [difficult, filter, isDue, practiced]);
  const active = mode === 'quick'
    ? interviewQuestions.find((q) => q.id === quickOrder[quickIndex]) ?? interviewQuestions[0]
    : interviewQuestions.find((q) => q.id === activeId) ?? interviewQuestions[0];
  const dueCount = interviewQuestions.filter((q) => progress.isDue(q.id)).length;

  const selectQuestion = (id: number) => { setActiveId(id); if (mode === 'quick') { const index = quickOrder.indexOf(id); if (index >= 0) setQuickIndex(index); } };
  const startDue = () => { const due = interviewQuestions.find((q) => progress.isDue(q.id)); if (due) { setActiveId(due.id); setMode('recall'); } else setMode('quick'); };
  const nextQuick = () => { setQuickIndex((value) => (value + 1) % quickOrder.length); };

  return (
    <div className="min-h-screen bg-[#f7f9fc] text-slate-800">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-3 py-3 sm:px-6">
          <Link href="/" className="text-sm font-semibold text-slate-500 hover:text-slate-900">← Home</Link>
          <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Interview practice</span>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-3 py-4 sm:px-6 sm:py-8">
        <section className="mb-4 flex flex-col gap-3 sm:mb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-700">{interviewIntro.company} · {interviewIntro.role}</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">Interview practice</h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">Don’t memorize 19 answers. Build a thinking path, then speak from it.</p>
          </div>
          <div className="text-xs text-slate-500 sm:text-right"><p className="font-semibold text-slate-700">Today’s goal</p><p className="mt-1">Recall 5 questions without reading the answer.</p><p className="mt-2 text-slate-400"><b className="text-slate-700">{progress.ready ? progress.practiced.size : 0}</b> practiced · <b className="text-slate-700">{progress.ready ? dueCount : 0}</b> due · <b className="text-slate-700">{progress.ready ? progress.difficult.size : 0}</b> difficult</p></div>
        </section>

        <section className="mb-4 flex flex-wrap items-center gap-2 sm:mb-6">
          <button type="button" onClick={startDue} className="min-h-11 rounded-xl bg-blue-700 px-4 text-sm font-bold text-white shadow-sm hover:bg-blue-800">{dueCount > 0 ? 'Practice due questions' : 'Start 5-question practice'}</button>
          <button type="button" onClick={() => { setMode('quick'); setQuickOrder(shuffle(interviewQuestions.map((q) => q.id))); setQuickIndex(0); }} className="min-h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600 hover:border-blue-400">Random practice</button>
        </section>

        <div className="grid gap-4 lg:grid-cols-[190px_minmax(0,680px)] lg:items-start lg:justify-center">
          <aside className="order-2 lg:order-1">
            <div className="flex items-center justify-between lg:block"><p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">Questions</p><span className="text-xs text-slate-400">{available.length} shown</span></div>
            <div className="mt-2 flex flex-wrap gap-1.5 lg:grid lg:grid-cols-5">
              {interviewQuestions.map((q) => <button key={q.id} type="button" onClick={() => selectQuestion(q.id)} aria-label={`Question ${q.id}`} className={`relative min-h-10 min-w-10 rounded-lg border text-xs font-bold transition ${active.id === q.id ? 'border-blue-700 bg-blue-700 text-white' : progress.difficult.has(q.id) ? 'border-amber-200 bg-amber-50 text-amber-800' : progress.practiced.has(q.id) ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-slate-200 bg-white text-slate-500 hover:border-blue-300'}`}>{String(q.id).padStart(2, '0')}{progress.isDue(q.id) && active.id !== q.id ? <span className="absolute -right-0.5 -top-0.5 h-1.5 w-1.5 rounded-full bg-rose-500" /> : null}</button>)}
            </div>
            <div className="mt-4 hidden space-y-1.5 text-[11px] text-slate-500 lg:block"><p><i className="mr-1 inline-block h-2 w-2 rounded-full bg-emerald-400" />Practiced</p><p><i className="mr-1 inline-block h-2 w-2 rounded-full bg-amber-400" />Difficult</p><p><i className="mr-1 inline-block h-2 w-2 rounded-full bg-rose-400" />Due today</p></div>
          </aside>

          <section className="order-1 min-w-0 lg:order-2">
            <div className="sticky top-0 z-10 -mx-3 mb-3 flex flex-wrap items-center gap-1.5 border-y border-slate-200 bg-[#f7f9fc]/95 px-3 py-2 backdrop-blur sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:px-0 sm:py-0">
              {(['recall', 'learn', 'quick', 'connections'] as const).map((value) => <button key={value} type="button" onClick={() => setMode(value)} className={`min-h-10 flex-1 rounded-lg px-2 text-xs font-bold sm:flex-none sm:px-3 ${mode === value ? 'bg-slate-900 text-white' : 'bg-white text-slate-500 hover:text-slate-900'}`}>{value === 'quick' ? 'Quick practice' : value === 'connections' ? 'Connections' : value[0].toUpperCase() + value.slice(1)}</button>)}
              <select aria-label="Question filter" value={filter} onChange={(e) => setFilter(e.target.value as Filter)} className="min-h-10 w-full rounded-lg border border-slate-200 bg-white px-2 text-xs font-semibold text-slate-600 sm:ml-auto sm:w-auto"><option value="all">All questions</option><option value="practiced">Practiced</option><option value="difficult">Difficult</option><option value="due">Due today ({dueCount})</option></select>
            </div>
            {mode === 'connections' ? <ConnectionsView selected={selectedContext} setSelected={setSelectedContext} onQuestion={(id) => { setActiveId(id); setMode('recall'); }} /> : filter !== 'all' && available.length === 0 ? <div className="rounded-2xl bg-white p-8 text-center text-sm text-slate-500">No questions match this filter.</div> : <PracticeSurface q={active} mode={mode} progress={progress} quickPosition={mode === 'quick' ? quickIndex + 1 : undefined} quickTotal={mode === 'quick' ? quickOrder.length : undefined} onNextQuick={nextQuick} />}
          </section>
        </div>

        <section className="mt-10 border-t border-slate-200 pt-5">
          <button type="button" onClick={() => setShowStrategy((v) => !v)} className="text-sm font-semibold text-slate-600 hover:text-blue-700">{showStrategy ? '− Hide' : '+ Show'} Context A–J · 10-second selection · interview mindset</button>
          {showStrategy && <StrategySection />}
        </section>
      </main>
    </div>
  );
}

function ConnectionsView({ selected, setSelected, onQuestion }: { selected: Context | null; setSelected: (context: Context | null) => void; onQuestion: (id: number) => void }) {
  const [clusterId, setClusterId] = useState<string | null>(null);
  const cluster = phraseClusters.find((item) => item.id === clusterId);
  return <div className="space-y-7">
    <div><p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-700">Recognize reusable patterns</p><h2 className="mt-1 text-2xl font-bold text-slate-950">{interviewQuestions.length} questions · 10 thinking patterns</h2><p className="mt-2 text-sm leading-6 text-slate-500">Learn the pattern once. Reuse it across several interview questions.</p></div>
    {selected ? <section className="rounded-2xl border border-blue-200 bg-blue-50/50 p-5"><div className="flex items-start justify-between"><div><p className="text-[11px] font-bold uppercase tracking-widest text-blue-700">Context {selected.id}</p><h3 className="mt-1 text-xl font-bold text-slate-950">{selected.title}</h3></div><button type="button" onClick={() => setSelected(null)} className="text-xs font-semibold text-slate-500">All contexts</button></div><Path steps={selected.path} /><p className="mt-5 text-[10px] font-bold uppercase tracking-widest text-slate-400">Same core · different interview angle</p><div className="mt-2 flex flex-wrap gap-2">{getQuestionsForContext(selected.id).map((id) => <button key={id} type="button" onClick={() => onQuestion(id)} className="rounded-lg bg-white px-3 py-2 text-left text-xs font-semibold text-slate-700 shadow-sm">Q{id} <span className="font-normal text-slate-500">· {questionLabel(id)}</span></button>)}</div></section> : <div className="grid gap-2 sm:grid-cols-2">{contexts.map((context) => <button key={context.id} type="button" onClick={() => setSelected(context)} className="rounded-xl border border-slate-200 bg-white p-4 text-left hover:border-blue-300"><p className="text-xs font-bold text-blue-700">{context.id}</p><h3 className="mt-1 font-bold text-slate-900">{context.title}</h3><Path steps={context.path} compact /><p className="mt-2 text-xs text-slate-500">Q{getQuestionsForContext(context.id).join(' · Q')}</p></button>)}</div>}
    <section><p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Phrase help</p><p className="mt-1 text-sm text-slate-500">Quiet support when you need a speaking sequence.</p><div className="mt-3 grid gap-2 sm:grid-cols-2">{phraseClusters.map((item) => <button key={item.id} type="button" onClick={() => setClusterId(clusterId === item.id ? null : item.id)} className={`rounded-xl border bg-white p-4 text-left ${clusterId === item.id ? 'border-blue-400' : 'border-slate-200'}`}><h3 className="font-bold text-slate-900">{item.title}</h3><Path steps={item.path} compact />{clusterId === item.id && <div className="mt-3 border-t border-slate-100 pt-3"><p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Used in</p><div className="mt-2 flex flex-wrap gap-1.5">{getQuestionsForCluster(item.id).map((id) => <span key={id} className="rounded-md bg-slate-50 px-2 py-1 text-xs font-semibold text-slate-700" onClick={(e) => { e.stopPropagation(); onQuestion(id); }}>Q{id}</span>)}</div></div>}</button>)}</div></section>
    <section><p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">One real story · several questions</p><div className="mt-3 grid gap-3 sm:grid-cols-3">{heroStories.map((story) => <div key={story.title} className="rounded-xl bg-white p-4"><h3 className="font-bold text-slate-900">{story.title}</h3><Path steps={story.path} compact /><p className="mt-3 text-xs text-slate-500">Useful for: Q{getQuestionsForStory(story.id).join(' · Q')}</p></div>)}</div></section>
    <TriggerDrill />
  </div>;
}
function Path({ steps, compact = false }: { steps: string[]; compact?: boolean }) { return <div className={`mt-3 flex flex-col items-start ${compact ? 'gap-0.5' : 'gap-1.5'}`}>{steps.map((step, index) => <div key={`${step}-${index}`} className="flex items-center gap-2"><span className={`${compact ? 'py-0.5 text-[11px]' : 'px-3 py-2 text-sm'} font-semibold text-slate-700`}>{step}</span>{index < steps.length - 1 && <span className="text-blue-300">↓</span>}</div>)}</div>; }
function TriggerDrill() { const [index, setIndex] = useState(0); const [show, setShow] = useState(false); const item = triggers[index]; return <section className="rounded-xl border border-slate-200 bg-white p-4"><p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-700">10-second reaction drill</p><p className="mt-2 text-sm text-slate-500">Interviewer says:</p><p className="mt-1 text-lg font-bold text-slate-950">“{item.phrases}”</p><button type="button" onClick={() => setShow(true)} className="mt-3 min-h-10 rounded-lg bg-slate-900 px-3 text-xs font-bold text-white">Reveal context</button>{show && <p className="mt-3 text-sm text-slate-700">Think context <b className="text-blue-700">{getContextsForTrigger(item.id).map((context) => context.id).join(' + ')}</b></p>}<button type="button" onClick={() => { setIndex((value) => (value + 1) % triggers.length); setShow(false); }} className="ml-3 min-h-10 px-2 text-xs font-semibold text-slate-500">Next trigger</button></section>; }

function PracticeSurface({ q, mode, progress, quickPosition, quickTotal, onNextQuick }: { q: InterviewQuestion; mode: Mode; progress: ReturnType<typeof useProgress>; quickPosition?: number; quickTotal?: number; onNextQuick: () => void }) {
  const audio = useInterviewAudio();
  const [revealed, setRevealed] = useState(mode === 'learn');
  const [hint, setHint] = useState(false);
  const [mapRequested, setMapRequested] = useState(false);
  const [showVi, setShowVi] = useState(false);
  const [cloze, setCloze] = useState(false);
  const [openNode, setOpenNode] = useState<string | null>(null);
  const [ideaIndex, setIdeaIndex] = useState(0);
  const [rated, setRated] = useState<ReviewDifficulty | null>(null);
  const level = progress.levels[q.id] ?? 1;
  const contextsForQuestion = useMemo(() => getContextsForQuestion(q.id), [q.id]);
  const starters = useMemo(() => questionStarters(q), [q]);
  const memoryNodes = useMemo(() => getMemoryNodes(q.id), [q.id]);
  const shouldShowMap = mode === 'recall' ? mapRequested || revealed || hint : level <= 4 || revealed || hint;
  const shownIdeas = mode === 'learn' || revealed ? q.answer.sections.length : Math.min(ideaIndex, q.answer.sections.length);

  const { stop: stopAudio } = audio;
  useEffect(() => { setRevealed(mode === 'learn'); setHint(false); setMapRequested(false); setShowVi(false); setCloze(false); setOpenNode(null); setIdeaIndex(0); setRated(null); stopAudio(); }, [q.id, mode, stopAudio]);

  const reveal = () => { setRevealed(true); setIdeaIndex(q.answer.sections.length); setHint(false); };
  const nextIdea = () => { setIdeaIndex((v) => Math.min(v + 1, q.answer.sections.length)); setHint(false); };
  const rate = (value: ReviewDifficulty) => { progress.review(q.id, value); setRated(value); };

  return <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.05)]">
    <div className="border-b border-slate-100 px-5 py-5 sm:px-8 sm:py-7">
      <div className="flex items-center justify-between gap-3 text-[11px] font-bold uppercase tracking-[0.16em] text-blue-700"><span>{mode === 'quick' ? `Question ${quickPosition} of ${quickTotal}` : `Question ${q.id} of ${interviewQuestions.length}`}</span><span>{contextsForQuestion.map((context) => `Context ${context.id}`).join(' · ')}</span></div>
      {mode === 'recall' && <p className="mt-4 text-xs font-semibold text-slate-400">Recall · Try without reading</p>}
      {mode === 'learn' && <p className="mt-4 text-xs font-semibold text-slate-400">Learn · Understand the structure, then the speech</p>}
      {mode === 'quick' && <p className="mt-4 text-xs font-semibold text-slate-400">Quick practice · Think first</p>}
      <h2 className="mt-2 max-w-3xl text-[1.35rem] font-bold leading-[1.35] tracking-tight text-slate-950 sm:text-[2rem]">{q.question.en}</h2>
      {(mode === 'learn' || revealed || showVi) && <p className="mt-3 text-sm leading-6 text-slate-500">{q.question.vi}</p>}
      <div className="mt-5 flex flex-wrap items-center gap-2"><button type="button" onClick={() => progress.togglePracticed(q.id)} className={`min-h-9 rounded-lg px-2 text-xs font-semibold ${progress.practiced.has(q.id) ? 'bg-emerald-50 text-emerald-700' : 'text-slate-400 hover:text-slate-700'}`}>{progress.practiced.has(q.id) ? '✓ Practiced' : 'Mark practiced'}</button><button type="button" onClick={() => progress.toggleDifficult(q.id)} className={`min-h-9 rounded-lg px-2 text-xs font-semibold ${progress.difficult.has(q.id) ? 'bg-amber-50 text-amber-700' : 'text-slate-400 hover:text-slate-700'}`}>{progress.difficult.has(q.id) ? '★ Difficult' : 'Mark difficult'}</button></div>
    </div>

    <div className="space-y-6 px-5 py-5 sm:px-8 sm:py-7">
      {mode === 'recall' && !shouldShowMap && <div className="flex items-center justify-between gap-3 rounded-lg border border-dashed border-slate-200 px-3 py-3"><p className="text-sm text-slate-500">Think in steps, not sentences. Ask for the map only if you get stuck.</p><button type="button" onClick={() => setMapRequested(true)} className="min-h-9 shrink-0 rounded-lg px-2 text-xs font-semibold text-blue-700 hover:bg-blue-50">Show memory path</button></div>}
      {mode !== 'quick' || shouldShowMap ? <MemoryPath nodes={memoryNodes} openNode={openNode} onOpen={setOpenNode} showAllHints={mode === 'learn' && level === 3} /> : <p className="text-sm font-medium text-slate-400">Think first. Reveal the map when you need a direction.</p>}

      {mode === 'learn' && <LevelControl level={level} onChange={(next) => progress.setLevel(q.id, next)} />}
      {mode !== 'learn' && <div className="grid grid-cols-2 gap-2 border-t border-slate-100 pt-5 sm:flex sm:flex-wrap sm:items-center"><button type="button" onClick={nextIdea} disabled={ideaIndex >= q.answer.sections.length} className="min-h-11 rounded-xl bg-blue-700 px-4 text-sm font-bold text-white disabled:opacity-40">Next idea</button><button type="button" onClick={() => setHint(true)} disabled={hint || ideaIndex >= q.answer.sections.length} className="min-h-10 rounded-lg px-2 text-xs font-semibold text-slate-500 hover:text-slate-800 disabled:opacity-40">Show hint</button><button type="button" onClick={reveal} disabled={revealed} className="min-h-10 rounded-lg border border-slate-200 px-3 text-xs font-semibold text-slate-600 disabled:opacity-40">Reveal answer</button><button type="button" onClick={() => { setIdeaIndex(0); setHint(false); setRevealed(false); setRated(null); }} className="min-h-10 px-2 text-xs font-semibold text-slate-400 hover:text-slate-700">Reset</button></div>}
      {hint && !revealed && starters[ideaIndex] && <p className="rounded-lg bg-blue-50 px-3 py-2 text-sm text-blue-800">Try starting with <b>{starters[ideaIndex]}</b></p>}

      {mode === 'quick' && !revealed && ideaIndex === 0 ? null : <AnswerContent q={q} show={revealed || mode === 'learn'} showVi={showVi} cloze={cloze} shownIdeas={shownIdeas} activeSection={openNode ? memoryNodes.find((node) => node.id === openNode)?.answerSectionId : undefined} audio={audio} />}
      {(revealed || mode === 'learn') && <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 pt-5"><button type="button" onClick={() => setShowVi((v) => !v)} className="min-h-10 px-2 text-xs font-semibold text-slate-400 hover:text-slate-700">{showVi ? 'Hide Vietnamese' : 'Show Vietnamese'}</button><button type="button" onClick={() => setCloze((v) => !v)} className={`min-h-10 rounded-lg border px-3 text-xs font-semibold ${cloze ? 'border-blue-300 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-600'}`}>Cloze</button></div>}
      {(revealed || mode === 'learn') && <ReviewPanel rated={rated} onRate={rate} onNext={mode === 'quick' ? onNextQuick : undefined} />}
    </div>
  </article>;
}

function MemoryPath({ nodes, openNode, onOpen, showAllHints = false }: { nodes: MemoryNode[]; openNode: string | null; onOpen: (id: string | null) => void; showAllHints?: boolean }) { return <div><div className="flex items-center justify-between"><Label>Memory path</Label><span className="text-[11px] text-slate-400">{showAllHints ? 'Compact cues' : 'Try to speak · tap a node if stuck'}</span></div><div className="mt-3 flex flex-col items-start gap-1 sm:flex-row sm:items-start sm:gap-0">{nodes.map((node, index) => { const expanded = showAllHints || openNode === node.id; return <div key={node.id} className="flex w-full flex-col items-start sm:w-auto sm:flex-row sm:items-start"><div className="w-full sm:w-auto"><button type="button" aria-expanded={expanded} onClick={() => onOpen(openNode === node.id ? null : node.id)} className={`min-h-11 w-full rounded-lg border px-3 text-left text-sm font-bold uppercase tracking-wide transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 sm:w-auto ${expanded ? 'border-blue-400 bg-blue-50 text-blue-800' : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-blue-300'}`}>{node.label}<span className="ml-2 text-[10px] font-medium normal-case tracking-normal text-blue-500">{expanded ? 'Hide hint' : '+ Hint'}</span></button>{expanded && <div className="mt-2 max-w-xs border-l-2 border-blue-100 pl-3 text-sm leading-7 text-slate-600">{node.triggers.map((trigger) => <div key={trigger}>{trigger}</div>)}</div>}</div>{index < nodes.length - 1 && <span aria-hidden="true" className="px-2 py-1 text-lg font-light text-blue-300 sm:pt-2">→</span>}</div>; })}</div></div>; }
function LevelControl({ level, onChange }: { level: LearningLevel; onChange: (level: LearningLevel) => void }) { return <div className="border-t border-slate-100 pt-5"><div className="flex items-center justify-between gap-3"><Label>Less help → more recall</Label><span className="text-xs font-semibold text-slate-500">{level} · {levelLabels[level]}</span></div><p className="mt-2 text-xs text-slate-400">Intentionally remove support until you can answer independently.</p><div className="mt-3 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-slate-400"><span>More support</span><span className="h-px flex-1 bg-slate-200" /><span>More recall</span></div><div className="mt-2 grid grid-cols-5 gap-1">{([1, 2, 3, 4, 5] as LearningLevel[]).map((value) => <button key={value} type="button" onClick={() => onChange(value)} className={`min-h-10 rounded-lg text-[10px] font-bold uppercase ${value === level ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-400 hover:text-slate-700'}`}>{levelLabels[value]}</button>)}</div></div>; }
function AnswerContent({ q, show, showVi, cloze, shownIdeas, activeSection, audio }: { q: InterviewQuestion; show: boolean; showVi: boolean; cloze: boolean; shownIdeas: number; activeSection?: string; audio: ReturnType<typeof useInterviewAudio> }) {
  if (!show && shownIdeas === 0) return null;
  const fullSource = q.answer.sections.map((section) => section.en).join(' ');
  const fullText = stripFormatting(fullSource);
  const fullKey = `q${q.id}-full`;
  const canPlayFull = Boolean(q.audio?.full) || audio.speechAvailable;
  let sectionOffset = 0;
  return <div><div className="flex flex-wrap items-center justify-between gap-2"><Label>Canonical answer</Label>{canPlayFull && <AudioControls audio={audio} request={{ text: fullText, src: q.audio?.full, alignment: q.audio?.alignment, key: fullKey, mapping: buildSpeechMapping(fullSource) }} label="Listen answer" />}</div><p className="mt-2 text-xs text-slate-400">Tap a phrase to hear it. Listen → repeat → continue.</p><div className="mt-3 max-w-2xl space-y-5">{q.answer.sections.slice(0, shownIdeas).map((paragraph) => {
    const offset = sectionOffset;
    sectionOffset += paragraph.en.length + 1;
    const trackedRange = audio.activeKey === fullKey ? audio.activeRange : audio.activeKey === `q${q.id}-${paragraph.id}` ? audio.activeRange : null;
    const rangeOffset = audio.activeKey === fullKey ? offset : 0;
    return <AnswerSectionView key={paragraph.id} paragraph={paragraph} questionId={q.id} src={q.audio?.sections?.[paragraph.id]} showVi={showVi} cloze={cloze} active={activeSection === paragraph.id} audio={audio} trackedRange={trackedRange} rangeOffset={rangeOffset} />;
  })}</div></div>;
}
function AudioControls({ audio, request, label }: { audio: ReturnType<typeof useInterviewAudio>; request: { text: string; src?: string; alignment?: string; key: string; mapping?: SpeechMapping }; label: string }) {
  const active = audio.activeKey === request.key;
  const playing = active && audio.state === 'playing';
  const paused = active && audio.state === 'paused';
  return <div className="flex flex-wrap items-center justify-end gap-1.5" aria-label={`${label} controls`}>
    {playing ? <button type="button" onClick={audio.pause} className="min-h-10 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-semibold text-slate-700">⏸ Pause</button> : paused ? <button type="button" onClick={audio.resume} className="min-h-10 rounded-lg border border-blue-200 bg-blue-50 px-2.5 text-xs font-semibold text-blue-700">▶ Resume</button> : <button type="button" onClick={() => audio.play(request)} className="min-h-10 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-semibold text-blue-700">▶ {label}</button>}
    {active && <button type="button" onClick={() => audio.restart(request)} aria-label={`Restart ${label.toLowerCase()}`} className="min-h-10 rounded-lg px-2 text-xs font-semibold text-slate-500 hover:bg-slate-50">↻</button>}
    <div className="flex rounded-lg border border-slate-200 bg-white p-0.5" aria-label="Playback speed">{([0.8, 1, 1.2] as AudioSpeed[]).map((value) => <button key={value} type="button" onClick={() => audio.setSpeed(value)} className={`min-h-9 rounded-md px-2 text-[11px] font-bold ${audio.speed === value ? 'bg-slate-900 text-white' : 'text-slate-500'}`}>{value}×</button>)}</div>
  </div>;
}

function AnswerSectionView({ paragraph, questionId, src, showVi, cloze, active, audio, trackedRange, rangeOffset }: { paragraph: { id: string; en: string; vi: string }; questionId: number; src?: string; showVi: boolean; cloze: boolean; active: boolean; audio: ReturnType<typeof useInterviewAudio>; trackedRange: AudioRange | null; rangeOffset: number }) {
  const parts = paragraph.en.split('/');
  const sectionKey = `q${questionId}-${paragraph.id}`;
  const sectionPlaying = audio.activeKey === sectionKey;
  const canPlaySection = Boolean(src) || audio.speechAvailable;
  const request = { text: stripFormatting(paragraph.en), src, key: sectionKey, mapping: buildSpeechMapping(paragraph.en) };
  return (
    <div className={`border-l-2 pl-4 transition-colors ${active || sectionPlaying ? 'border-blue-400 bg-blue-50/40' : 'border-blue-100'}`}>
      <div className="flex items-start justify-between gap-2">
        <p className="min-w-0 flex-1 text-[15px] leading-8 text-slate-800 sm:text-base">
          {cloze ? <ClozeText text={paragraph.en} /> : parts.map((part, index) => {
            const chunkKey = `q${questionId}-${paragraph.id}-chunk-${index}`;
            const chunkStart = parts.slice(0, index).reduce((total, value) => total + value.length + 1, 0);
            const chunkEnd = chunkStart + part.length;
            const chunkActive = audio.activeKey === chunkKey;
            const phraseRange = chunkActive ? audio.activeRange : trackedRange;
            const phraseHighlighted = Boolean(phraseRange && chunkStart < phraseRange.end - rangeOffset && chunkEnd > phraseRange.start - rangeOffset);
            const speechText = stripFormatting(part);
            return <span key={`${paragraph.id}-${index}`}>{index > 0 && ' '}<button type="button" disabled={!audio.speechAvailable} onClick={() => audio.play({ text: speechText, key: chunkKey, mapping: buildSpeechMapping(part) })} aria-label={`Play phrase: ${speechText.trim()}`} className={`rounded px-0.5 text-left transition-colors hover:bg-blue-50 focus-visible:bg-blue-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-default disabled:opacity-100 ${phraseHighlighted ? 'bg-blue-100 text-blue-950' : ''}`}>{renderTrackedText(part)}</button></span>;
          })}
        </p>
        {canPlaySection && <button type="button" onClick={() => audio.play(request)} aria-label={`Play answer section ${paragraph.id}`} className={`min-h-10 min-w-10 shrink-0 rounded-lg text-xs font-semibold transition-colors hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${sectionPlaying ? 'bg-blue-50 text-blue-700' : 'text-slate-400'}`}>Listen</button>}
      </div>
      {showVi && <p className="mt-1 text-sm leading-6 text-slate-400">{paragraph.vi}</p>}
    </div>
  );
}

function renderTrackedText(text: string) {
  return parseInlineRanges(text).map((token, tokenIndex) => {
    const content = token.value;
    if (token.kind === 'bold') return <strong key={`${tokenIndex}`} className="font-semibold text-slate-900">{content}</strong>;
    if (token.kind === 'italic') return <em key={`${tokenIndex}`} className="font-medium not-italic text-blue-700">{content}</em>;
    return <span key={`${tokenIndex}`}>{content}</span>;
  });
}

function ClozeText({ text }: { text: string }) { const [visible, setVisible] = useState(false); const item = clozeText(text); if (!item) return <RichText text={text} />; return <><RichText text={item.before} /><button type="button" onClick={() => setVisible(true)} className="mx-1 min-h-8 rounded border border-dashed border-blue-300 px-2 font-semibold text-blue-700">{visible ? item.hidden : '______'}</button><RichText text={item.after} /></>; }
function ReviewPanel({ rated, onRate, onNext }: { rated: ReviewDifficulty | null; onRate: (value: ReviewDifficulty) => void; onNext?: () => void }) { return <div className="rounded-xl bg-slate-50 px-4 py-4"><p className="text-sm font-semibold text-slate-700">How did that feel?</p><div className="mt-3 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">{(Object.keys(reviewLabels) as ReviewDifficulty[]).map((value) => <button key={value} type="button" onClick={() => onRate(value)} className={`min-h-10 rounded-lg border px-3 text-xs font-bold ${rated === value ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-200 bg-white text-slate-600'}`}>{reviewLabels[value]}</button>)}{onNext && <button type="button" onClick={onNext} className="min-h-10 rounded-lg bg-slate-900 px-3 text-xs font-bold text-white">Next question →</button>}</div>{rated && <p className="mt-3 text-xs text-slate-500">Saved as <b className="text-slate-700">{reviewLabels[rated]}</b>. Continue when ready.</p>}</div>; }
function Label({ children }: { children: React.ReactNode }) { return <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">{children}</p>; }
function shuffle<T>(values: T[]) { const result = [...values]; for (let i = result.length - 1; i > 0; i -= 1) { const j = Math.floor(Math.random() * (i + 1)); [result[i], result[j]] = [result[j] as T, result[i] as T]; } return result; }

function StrategySection() { return <div className="mt-5 space-y-5"><div className="overflow-x-auto rounded-xl border border-slate-200 bg-white"><table className="min-w-full text-sm"><thead className="bg-slate-50 text-left text-[10px] uppercase tracking-widest text-slate-500"><tr><th className="px-3 py-2">Code</th><th className="px-3 py-2">Context</th><th className="px-3 py-2">Trigger words</th><th className="px-3 py-2">Q#</th></tr></thead><tbody className="divide-y divide-slate-100">{strategyRows.map((r) => <tr key={r.code}><td className="px-3 py-2 font-bold text-blue-700">{r.code}</td><td className="px-3 py-2 font-medium text-slate-900">{r.context}</td><td className="px-3 py-2 text-slate-600">{r.triggers}</td><td className="px-3 py-2 text-slate-500">{r.questions}</td></tr>)}</tbody></table></div><div className="grid gap-4 sm:grid-cols-2"><div className="rounded-xl border border-slate-200 bg-white p-4"><Label>10-second selection flow</Label><ol className="mt-2 list-decimal space-y-1.5 pl-5 text-sm text-slate-700">{selectionFlow.map((s) => <li key={s}>{s}</li>)}</ol></div><div className="rounded-xl border border-slate-200 bg-white p-4"><Label>Three reusable stories</Label><ul className="mt-2 space-y-2 text-sm text-slate-700">{reusableStories.map((s) => <li key={s.title}><b className="text-slate-900">{s.title}: </b>{s.body}</li>)}</ul></div></div><div className="rounded-xl border border-slate-200 bg-white p-4"><Label>Gap answer formula</Label><p className="mt-2 text-sm text-slate-700">{gapFormula}</p></div><div className="rounded-xl border border-slate-200 bg-white p-4"><Label>Final interview mindset</Label><ul className="mt-2 space-y-2 text-sm text-slate-700">{finalMindset.map((m) => <li key={m.label}><b className="text-slate-900">{m.label}: </b>{m.body}</li>)}</ul></div></div>; }
