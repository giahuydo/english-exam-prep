'use client';

import Link from 'next/link';
import { useState } from 'react';
import { buildSpeechMapping, useInterviewAudio, type AudioRange, type AudioSpeed } from '../audio';
import { backendTopics, recommendedPath } from './topics';
import { speakingChunks } from './speaking-chunks';

// Calm accents echo the AI Interview phrase palette without affecting the source text.
const speakingAccents = [
  'border-blue-200 bg-blue-50/60 text-blue-900',
  'border-emerald-200 bg-emerald-50/60 text-emerald-900',
  'border-amber-200 bg-amber-50/60 text-amber-900',
  'border-sky-200 bg-sky-50/60 text-sky-900',
];

function SpeakingAnswer({ answer, activeRange }: { answer: string; activeRange: AudioRange | null }) {
  const chunks = speakingChunks(answer);
  let offset = 0;
  return <div>
    <p className="sr-only">{answer}</p>
    <div aria-hidden="true" className="text-[15px] leading-9">
      {chunks.map((chunk, index) => {
        const start = offset;
        offset += chunk.length;
        const text = chunk.trimEnd();
        const highlightStart = activeRange ? Math.max(0, Math.min(text.length, activeRange.start - start)) : 0;
        const highlightEnd = activeRange ? Math.max(0, Math.min(text.length, activeRange.end - start)) : 0;
        return <span key={index}>
          <span className={`box-decoration-clone rounded-md border-l-2 px-2 py-1 ${speakingAccents[index % speakingAccents.length]}`}>
            {highlightEnd > highlightStart ? <>{text.slice(0, highlightStart)}<span className="rounded bg-slate-900 px-0.5 font-semibold text-white ring-1 ring-slate-700">{text.slice(highlightStart, highlightEnd)}</span>{text.slice(highlightEnd)}</> : text}
          </span>
          {index < chunks.length - 1 && <span className="mx-2 select-none text-xs text-slate-300">/</span>}
        </span>;
      })}
    </div>
  </div>;
}

export default function BackendInterviewPage() {
  const audio = useInterviewAudio({ speedKey: 'ee.interview.backend.audio-speed.v1', defaultSpeed: 0.8 });
  const [topicId, setTopicId] = useState(1);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(true);
  const [showKey, setShowKey] = useState(true);
  const [showVi, setShowVi] = useState(false);
  const [showFramework, setShowFramework] = useState(false);
  const topic = backendTopics.find((item) => item.id === topicId) ?? backendTopics[0];
  const questions = topic.questions;
  const question = questions[questionIndex] ?? questions[0];
  const pathIndex = recommendedPath.findIndex((id) => id === topic.id);
  const selectTopic = (id: number) => { audio.stop(); setTopicId(id); setQuestionIndex(0); setShowAnswer(true); setShowKey(true); };
  const selectQuestion = (index: number) => { audio.stop(); setQuestionIndex(index); setShowAnswer(true); setShowKey(true); };
  const audioKey = `backend-t${String(topic.id).padStart(2, '0')}-q${String(questionIndex + 1).padStart(2, '0')}`;
  const audioPath = `/audio/interview/backend/${audioKey.slice('backend-'.length)}`;
  const mapping = question ? buildSpeechMapping(question.answer) : null;
  const request = mapping ? { text: mapping.text, src: `${audioPath}/full.mp3`, alignment: `${audioPath}/alignment.json`, mapping, key: audioKey } : null;
  const playingThisAnswer = audio.activeKey === audioKey;

  return <div className="min-h-screen bg-[#f7f9fc] text-slate-800">
    <header className="border-b border-slate-200 bg-white"><div className="mx-auto flex max-w-6xl items-center justify-between px-3 py-3 sm:px-6"><Link href="/" className="text-sm font-semibold text-slate-500 hover:text-slate-900">← Home</Link><span className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">Interview practice</span></div></header>
    <nav className="border-b border-slate-200 bg-white" aria-label="Interview category"><div className="mx-auto flex max-w-6xl gap-1 px-3 sm:px-6"><Link href="/interview" className="border-b-2 border-transparent px-3 py-3 text-sm font-semibold text-slate-500 hover:border-slate-300 hover:text-slate-900">AI Interview</Link><Link href="/interview/backend" aria-current="page" className="border-b-2 border-blue-700 px-3 py-3 text-sm font-bold text-blue-700">Backend Interview</Link></div></nav>
    <main className="mx-auto max-w-6xl px-3 py-4 sm:px-6 sm:py-8">
      <section className="mb-5"><p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-700">B1–B2 Speaking Pack</p><h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">Senior Backend Node.js Interview</h1><p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">Choose a topic and question. Read the B1–B2 answer, then recall its key idea.</p></section>
      <section aria-label="Recommended learning path" className="mb-6 rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-4"><p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-700">Recommended path · 7 stops</p><div className="mt-3 flex flex-wrap items-center gap-1.5">{recommendedPath.map((id, index) => <div key={id} className="flex items-center gap-1.5">{index > 0 && <span aria-hidden="true" className="text-blue-300">→</span>}<button type="button" onClick={() => selectTopic(id)} aria-current={topicId === id ? 'step' : undefined} className={`min-h-10 rounded-lg border px-2.5 py-1 text-left text-xs font-semibold transition ${topicId === id ? 'border-blue-700 bg-blue-700 text-white' : 'border-blue-100 bg-white text-blue-800 hover:border-blue-400'}`}>{id}. {backendTopics[id - 1].title}</button></div>)}</div></section>
      <div className="grid gap-4 lg:grid-cols-[240px_minmax(0,680px)] lg:items-start lg:justify-center">
        <aside className="order-2 lg:order-1"><p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">12 topics</p><div className="mt-2 grid gap-1.5 sm:grid-cols-2 lg:grid-cols-1">{backendTopics.map((item) => <button key={item.id} type="button" onClick={() => selectTopic(item.id)} aria-current={topicId === item.id ? 'true' : undefined} className={`flex min-h-11 items-center gap-2 rounded-lg border px-3 py-2 text-left text-xs font-semibold transition ${topicId === item.id ? 'border-blue-700 bg-blue-700 text-white' : 'border-slate-200 bg-white text-slate-700 hover:border-blue-300'}`}><span className="shrink-0 font-bold">{String(item.id).padStart(2, '0')}</span>{item.title}</button>)}</div></aside>
        <section className="order-1 min-w-0 lg:order-2"><div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.05)]"><div className="border-b border-slate-100 px-5 py-5 sm:px-8 sm:py-7"><p className="text-[11px] font-bold uppercase tracking-[0.16em] text-blue-700">Topic {topic.id} of {backendTopics.length}</p><h2 className="mt-2 text-[1.35rem] font-bold text-slate-950 sm:text-[2rem]">{topic.title}</h2></div><div className="space-y-6 px-5 py-5 sm:px-8 sm:py-7">
          <div><p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Questions</p><div className="mt-3 flex flex-wrap gap-2">{questions.map((item, index) => <button key={item.question} type="button" onClick={() => selectQuestion(index)} aria-current={questionIndex === index ? 'true' : undefined} aria-label={`Question ${index + 1}: ${item.question}`} className={`min-h-10 min-w-10 rounded-lg border px-3 text-xs font-bold ${questionIndex === index ? 'border-blue-700 bg-blue-700 text-white' : 'border-slate-200 bg-white text-slate-600 hover:border-blue-300'}`}>Q{index + 1}</button>)}</div></div>
          {question ? <div className="space-y-5 border-t border-slate-100 pt-5"><div><div className="flex flex-wrap items-center justify-between gap-2"><p className="text-[11px] font-bold uppercase tracking-[0.16em] text-blue-700">Question {questionIndex + 1} of {questions.length}</p><button type="button" onClick={() => setShowVi((value) => !value)} aria-pressed={showVi} className="min-h-10 rounded-lg border border-slate-200 px-3 text-xs font-semibold text-slate-500 hover:border-blue-300 hover:text-slate-700">{showVi ? 'Hide Vietnamese' : 'Show Vietnamese'}</button></div><h3 className="mt-2 text-xl font-bold leading-7 text-slate-950">{question.question}</h3>{showVi && <p lang="vi" className="mt-2 text-sm leading-6 text-slate-500">{question.questionVi}</p>}</div><section><div className="flex flex-wrap items-center justify-between gap-2"><h4 className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Answer (B1–B2)</h4><button type="button" onClick={() => { if (showAnswer) audio.stop(); setShowAnswer((value) => !value); }} aria-expanded={showAnswer} className="min-h-10 rounded-lg border border-slate-200 px-3 text-xs font-semibold text-blue-700">{showAnswer ? 'Hide answer' : 'Show answer'}</button></div>{showAnswer && <div className="mt-2 border-l-2 border-blue-100 pl-4"><div className="mb-3 flex flex-wrap items-center gap-2" aria-label="Answer audio controls">
                  {playingThisAnswer && audio.state === 'playing' ? <button type="button" onClick={audio.pause} className="min-h-10 rounded-lg border border-blue-200 bg-blue-50 px-3 text-xs font-semibold text-blue-700">⏸ Pause</button> : playingThisAnswer && audio.state === 'paused' ? <button type="button" onClick={audio.resume} className="min-h-10 rounded-lg border border-blue-200 bg-blue-50 px-3 text-xs font-semibold text-blue-700">▶ Resume</button> : <button type="button" onClick={() => request && audio.play(request)} className="min-h-10 rounded-lg border border-slate-200 px-3 text-xs font-semibold text-blue-700">▶ Listen answer</button>}
                  {playingThisAnswer && <button type="button" onClick={() => audio.stop()} className="min-h-10 px-2 text-xs font-semibold text-slate-500">Stop</button>}
                  <button type="button" onClick={() => audio.setRepeat(!audio.repeat)} aria-pressed={audio.repeat} className={`min-h-10 rounded-lg border px-2 text-xs font-semibold ${audio.repeat ? 'border-blue-400 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-500'}`}>↻ Repeat</button>
                  <div className="flex rounded-lg border border-slate-200 p-0.5" aria-label="Playback speed">{([0.5, 0.8, 1] as AudioSpeed[]).map((speed) => <button key={speed} type="button" onClick={() => audio.setSpeed(speed)} aria-pressed={audio.speed === speed} className={`min-h-9 rounded-md px-2 text-xs font-bold ${audio.speed === speed ? 'bg-slate-900 text-white' : 'text-slate-500'}`}>{speed}×</button>)}</div>
                </div><SpeakingAnswer answer={question.answer} activeRange={playingThisAnswer ? audio.activeRange : null} />{showVi && <p lang="vi" className="mt-2 text-sm leading-6 text-slate-500">{question.answerVi}</p>}</div>}</section><section className="border-t border-slate-100 pt-5"><div className="flex flex-wrap items-center justify-between gap-2"><h4 className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Key idea</h4><button type="button" onClick={() => setShowKey((value) => !value)} aria-expanded={showKey} className="min-h-10 rounded-lg border border-slate-200 px-3 text-xs font-semibold text-blue-700">{showKey ? 'Hide key idea' : 'Show key idea'}</button></div>{showKey && <div className="mt-2 rounded-xl bg-blue-50 p-4"><p className="text-sm leading-7 text-blue-950">{question.keyIdea}</p>{showVi && <p lang="vi" className="mt-1 text-sm leading-6 text-slate-500">{question.keyIdeaVi}</p>}</div>}</section>{questionIndex < questions.length - 1 && <button type="button" onClick={() => selectQuestion(questionIndex + 1)} className="min-h-11 rounded-xl bg-blue-700 px-4 text-sm font-bold text-white hover:bg-blue-800">Next question →</button>}</div> : <p className="border-t border-slate-100 pt-5 text-sm text-slate-500">Questions for this topic have not been provided yet.</p>}
        </div></div>{pathIndex >= 0 && pathIndex < recommendedPath.length - 1 && <button type="button" onClick={() => selectTopic(recommendedPath[pathIndex + 1])} className="mt-4 min-h-10 rounded-lg border border-blue-200 bg-white px-3 text-xs font-semibold text-blue-700 hover:bg-blue-50">Next recommended topic →</button>}</section>
      </div>
      <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-5">
        <button type="button" onClick={() => setShowFramework((value) => !value)} aria-expanded={showFramework} className="flex w-full items-center justify-between gap-3 text-left text-sm font-bold text-slate-800"><span>Quick Interview Framework</span><span className="text-xs text-blue-700">{showFramework ? 'Hide' : 'Show'}</span></button>
        {showFramework && <div className="mt-4 border-t border-slate-100 pt-4">
          <p className="text-sm text-slate-600">For technical scenario questions, use this simple flow:</p>
          <ol className="mt-2 list-inside list-decimal space-y-1 text-sm leading-7 text-slate-700">
            <li>Identify the likely problem.</li>
            <li>Explain why it can happen.</li>
            <li>Say what you would check first.</li>
            <li>Give the solution or options.</li>
            <li>Mention one trade-off when relevant.</li>
          </ol>
          <p className="mt-4 text-sm leading-7 text-slate-700">Useful speaking connectors: Basically • First • Then • For example • In this case • The main reason is • Depending on the use case • Finally • So overall</p>
        </div>}
      </section>
    </main>
  </div>;
}
