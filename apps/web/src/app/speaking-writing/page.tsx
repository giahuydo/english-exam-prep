'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Badge, Button, Card, ProgressBar, SectionTitle } from '@/components/ui';
import { StudentShell } from '@/components/shells';
import { learnerCopy, useLanguage } from '@/lib/language';
import { countWords, formatClock, nextWritingStep, recordingSupport, type WritingStep } from '@/lib/speaking-writing-utils';

type Mode = 'speaking' | 'writing';
type SpeakingPart = 'social' | 'solution' | 'topic';
type WritingTask = 'task1' | 'task2';
type Confidence = 'Know' | 'Unsure' | 'Guess' | null;

const speakingParts = [
  { id: 'social' as const, en: 'Social interaction', vi: 'Tương tác xã hội', cue: 'Answer naturally, then add one supporting detail.', seconds: 180, prompt: 'Talk about a daily habit that helps you study effectively.', chunks: ['Answer directly', 'Add one detail', 'Close naturally'] },
  { id: 'solution' as const, en: 'Solution discussion', vi: 'Thảo luận giải pháp', cue: 'State a choice, give two reasons, and respond to another view.', seconds: 240, prompt: 'Your class wants to improve group study. Which idea should it try first?', chunks: ['Choose a solution', 'Give two reasons', 'Respond to another view'] },
  { id: 'topic' as const, en: 'Topic development', vi: 'Phát triển chủ đề', cue: 'Develop a clear position with connected points and an example.', seconds: 300, prompt: 'Discuss how technology can improve learning while creating new challenges.', chunks: ['State your position', 'Connect two points', 'Give an example'] },
];
const writingTasks = [
  { id: 'task1' as const, en: 'Task 1 · Email / letter', vi: 'Bài 1 · Email / thư', words: 120, seconds: 1200, prompt: 'Write an email to a course coordinator asking for information about a study skills workshop.' },
  { id: 'task2' as const, en: 'Task 2 · Essay', vi: 'Bài 2 · Bài luận', words: 250, seconds: 2400, prompt: 'Some people think university students should do community work. Discuss your view and support it with reasons and examples.' },
];
const writingSteps: Array<{ id: WritingStep; en: string; vi: string }> = [
  { id: 'understand', en: 'Understand', vi: 'Hiểu đề' }, { id: 'outline', en: 'Outline', vi: 'Lập dàn ý' }, { id: 'draft', en: 'Draft', vi: 'Viết nháp' }, { id: 'checklist', en: 'Checklist', vi: 'Tự kiểm tra' }, { id: 'submit', en: 'Submit', vi: 'Nộp bài' },
];
const reflectionPrompts = ['I answered the task directly.', 'My ideas were connected and organized.', 'I used precise vocabulary and grammar.', 'I spoke clearly enough to be understood.'];

export default function SpeakingWritingTrainerV2() {
  const { language } = useLanguage();
  const copy = learnerCopy[language];
  const vi = language === 'vi';
  const [mode, setMode] = useState<Mode>('speaking');
  const [part, setPart] = useState<SpeakingPart>('social');
  const [task, setTask] = useState<WritingTask>('task1');
  const [running, setRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [draft, setDraft] = useState('');
  const [writingStep, setWritingStep] = useState<WritingStep>('understand');
  const [confidence, setConfidence] = useState<Confidence>(null);
  const [checked, setChecked] = useState([false, false, false, false]);
  const [recording, setRecording] = useState(false);
  const [recordingStatus, setRecordingStatus] = useState<'ready' | 'unavailable' | 'permission-denied'>('unavailable');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const mediaRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const currentPart = speakingParts.find((item) => item.id === part)!;
  const currentTask = writingTasks.find((item) => item.id === task)!;
  const prompt = mode === 'speaking' ? currentPart.prompt : currentTask.prompt;
  const timeLimit = mode === 'speaking' ? currentPart.seconds : currentTask.seconds;
  const remaining = Math.max(0, timeLimit - seconds);
  const wordCount = countWords(draft);

  useEffect(() => {
    if (!running) return undefined;
    const timer = window.setInterval(() => setSeconds((value) => {
      if (value + 1 >= timeLimit) { setRunning(false); return timeLimit; }
      return value + 1;
    }), 1000);
    return () => window.clearInterval(timer);
  }, [running, timeLimit]);
  useEffect(() => { if (mode === 'writing') setDraft(window.localStorage.getItem(`vstep-writing-draft-${task}`) ?? ''); }, [mode, task]);
  useEffect(() => { if (mode === 'writing') window.localStorage.setItem(`vstep-writing-draft-${task}`, draft); }, [draft, mode, task]);
  const reset = () => { setSeconds(0); setRunning(false); setWritingStep('understand'); setConfidence(null); setChecked([false, false, false, false]); setAudioUrl(null); setRecording(false); };
  const speak = () => { if ('speechSynthesis' in window) { window.speechSynthesis.cancel(); window.speechSynthesis.speak(new SpeechSynthesisUtterance(prompt)); } };
  async function startRecording() { if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') { setRecordingStatus(recordingSupport(false, false)); return; } try { const stream = await navigator.mediaDevices.getUserMedia({ audio: true }); const recorder = new MediaRecorder(stream); chunksRef.current = []; recorder.ondataavailable = (event) => { if (event.data.size) chunksRef.current.push(event.data); }; recorder.onstop = () => { stream.getTracks().forEach((track) => track.stop()); setAudioUrl(URL.createObjectURL(new Blob(chunksRef.current, { type: recorder.mimeType }))); setRecording(false); }; mediaRef.current = recorder; recorder.start(); setRecordingStatus('ready'); setRecording(true); } catch { setRecordingStatus('permission-denied'); } }
  const statusText = recordingStatus === 'unavailable' ? copy.recordUnavailable : recordingStatus === 'permission-denied' ? copy.permissionDenied : copy.recordReady;
  const toggleCheck = (index: number) => setChecked((items) => items.map((value, i) => i === index ? !value : value));
  const confidenceButtons = (['Know', 'Unsure', 'Guess'] as const).map((value) => <button key={value} type="button" onClick={() => setConfidence(value)} className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${confidence === value ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-200 bg-white text-slate-700'}`}>{copy[value.toLowerCase() as 'know' | 'unsure' | 'guess']}</button>);

  return <StudentShell>
    <SectionTitle eyebrow={vi ? 'Huấn luyện kỹ năng' : 'VSTEP skill trainer'} title={vi ? 'Luyện nói và viết theo quy trình' : 'Build a VSTEP response, one step at a time'} description={vi ? 'Dùng quy trình và tự phản hồi để ghi nhớ kỹ năng — không học thuộc bài mẫu.' : 'Use a repeatable process and self-review to build durable skill — not a memorized script.'} action={<div className="flex rounded-xl border border-slate-200 bg-white p-1"><button type="button" onClick={() => { setMode('speaking'); reset(); }} className={`rounded-lg px-3 py-2 text-sm font-semibold ${mode === 'speaking' ? 'bg-blue-600 text-white' : 'text-slate-500'}`}>{copy.speaking}</button><button type="button" onClick={() => { setMode('writing'); reset(); }} className={`rounded-lg px-3 py-2 text-sm font-semibold ${mode === 'writing' ? 'bg-blue-600 text-white' : 'text-slate-500'}`}>{copy.writing}</button></div>} />
    <Card className="mb-5 border-violet-200 bg-violet-50/60"><p className="text-xs font-bold uppercase tracking-widest text-violet-700">{copy.target}</p><h2 className="mt-2 text-lg font-bold text-violet-950">VSTEP B1/B2</h2><p className="mt-1 text-sm text-violet-800">{copy.vstepLevelHelper}</p><div className="mt-3"><Badge tone="blue">{copy.noOfficialScore}</Badge></div></Card>
    {mode === 'speaking' ? <>
      <div className="mb-5 grid gap-3 md:grid-cols-3">{speakingParts.map((item, index) => <button type="button" key={item.id} onClick={() => { setPart(item.id); reset(); }} className={`rounded-2xl border p-4 text-left ${part === item.id ? 'border-blue-600 bg-blue-600 text-white shadow-md' : 'border-slate-200 bg-white hover:border-blue-300'}`}><span className="text-xs font-bold">{copy.part} {index + 1}</span><span className="mt-2 block font-bold">{vi ? item.vi : item.en}</span><span className={`mt-1 block text-xs ${part === item.id ? 'text-blue-100' : 'text-slate-500'}`}>{formatClock(item.seconds)} · {vi ? 'trình tự chính thức' : 'official sequence'}</span></button>)}</div>
      <div className="grid gap-5 lg:grid-cols-[1.1fr_.9fr]"><Card><div className="flex items-center justify-between gap-3"><Badge tone="blue">{vi ? currentPart.vi : currentPart.en}</Badge><span className={`font-mono text-lg font-bold ${remaining < 30 ? 'text-rose-600' : 'text-slate-700'}`}>{formatClock(remaining)}</span></div><ProgressBar value={(seconds / timeLimit) * 100} /><p className="mt-5 text-xs font-bold uppercase tracking-widest text-blue-600">{copy.academicPrompt}</p><h2 className="mt-2 text-xl font-bold leading-8 text-slate-950">{prompt}</h2><p className="mt-3 text-sm leading-6 text-slate-500">{currentPart.cue}</p><div className="mt-5 flex flex-wrap gap-2">{currentPart.chunks.map((chunk) => <Badge key={chunk} tone="slate">{chunk}</Badge>)}</div><div className="mt-6 flex flex-wrap gap-2"><Button onClick={() => setRunning((value) => !value)}>{running ? copy.pause : copy.startPrep}</Button><Button className="bg-white text-slate-700 shadow-none hover:bg-slate-50" onClick={reset}>{copy.reset}</Button><Button className="bg-white text-slate-700 shadow-none hover:bg-slate-50" onClick={speak}>{copy.readPrompt}</Button>{recording ? <Button className="bg-rose-600 hover:bg-rose-700" onClick={() => mediaRef.current?.stop()}>{copy.stopRecording}</Button> : <Button className="bg-violet-600 hover:bg-violet-700" onClick={startRecording}>{copy.recordResponse}</Button>}</div><p className="mt-3 text-xs text-slate-500">{statusText}</p>{audioUrl && <audio className="mt-4 w-full" controls src={audioUrl} />}</Card><Card><p className="text-xs font-bold uppercase tracking-widest text-blue-600">{copy.selfReview}</p><p className="mt-2 text-sm text-slate-500">{copy.selfReviewHelper}</p><div className="mt-4 space-y-2">{reflectionPrompts.map((item, index) => <button type="button" key={item} onClick={() => toggleCheck(index)} className={`flex w-full items-start gap-3 rounded-xl border p-3 text-left text-sm ${checked[index] ? 'border-emerald-300 bg-emerald-50' : 'border-slate-200 bg-white'}`}><span className="font-bold text-emerald-700">{checked[index] ? '✓' : '○'}</span>{vi ? ['Trả lời đúng nhiệm vụ.', 'Ý được liên kết và sắp xếp rõ.', 'Dùng từ vựng và ngữ pháp phù hợp.', 'Phát âm đủ rõ để người nghe hiểu.'][index] : item}</button>)}</div><p className="mt-5 text-xs font-semibold text-slate-500">{copy.reflectionPrompts}</p><div className="mt-2 flex flex-wrap gap-2">{confidenceButtons}</div><p className="mt-4 text-xs text-slate-400">{copy.memoryHook}</p></Card></div>
    </> : <>
      <div className="mb-5 grid gap-3 md:grid-cols-2">{writingTasks.map((item) => <button type="button" key={item.id} onClick={() => { setTask(item.id); reset(); }} className={`rounded-2xl border p-4 text-left ${task === item.id ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-200 bg-white hover:border-blue-300'}`}><span className="block font-bold">{vi ? item.vi : item.en}</span><span className={`mt-1 block text-xs ${task === item.id ? 'text-blue-100' : 'text-slate-500'}`}>{item.words}+ words · {formatClock(item.seconds)} {vi ? 'toàn bài' : 'total'}</span></button>)}</div>
      <div className="mb-5 grid grid-cols-5 gap-1.5 overflow-x-auto">{writingSteps.map((item, index) => <button type="button" key={item.id} onClick={() => setWritingStep(item.id)} className={`min-w-[72px] rounded-xl border px-2 py-3 text-xs font-bold ${writingStep === item.id ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-200 bg-white text-slate-600'}`}><span className="block text-[10px]">{index + 1}</span>{vi ? item.vi : item.en}</button>)}</div>
      <div className="grid gap-5 lg:grid-cols-[1.1fr_.9fr]"><Card><div className="flex items-center justify-between gap-3"><Badge tone="blue">{vi ? currentTask.vi : currentTask.en}</Badge><span className={`font-mono text-lg font-bold ${remaining < 60 ? 'text-rose-600' : 'text-slate-700'}`}>{formatClock(remaining)}</span></div><ProgressBar value={(seconds / timeLimit) * 100} /><p className="mt-5 text-xs font-bold uppercase tracking-widest text-blue-600">{copy.academicPrompt}</p><h2 className="mt-2 text-xl font-bold leading-8 text-slate-950">{currentTask.prompt}</h2>{writingStep === 'understand' && <div className="mt-5 rounded-xl border border-dashed border-blue-200 bg-blue-50/40 p-4 text-sm text-blue-950">{copy.understandPrompt}</div>}{writingStep === 'outline' && <div className="mt-5 rounded-xl border border-dashed border-blue-200 bg-blue-50/40 p-4 text-sm text-blue-950">{copy.outlinePrompt}</div>}{writingStep !== 'understand' && writingStep !== 'outline' && <textarea aria-label={copy.draftResponse} value={draft} onChange={(event) => setDraft(event.target.value)} placeholder={copy.draftPlaceholder} className="mt-5 min-h-48 w-full resize-y rounded-xl border border-slate-200 p-4 text-sm leading-6 text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />}<div className="mt-2 flex items-center justify-between text-xs font-semibold"><span className={wordCount >= currentTask.words ? 'text-emerald-700' : 'text-amber-700'}>{wordCount} / {currentTask.words}+ words</span><span>{wordCount >= currentTask.words ? copy.minimumMet : copy.minimumNotMet}</span></div><div className="mt-5 flex flex-wrap gap-2"><Button onClick={() => { setRunning((value) => !value); setWritingStep('draft'); }}>{running ? copy.pause : copy.startWriting}</Button><Button className="bg-white text-slate-700 shadow-none hover:bg-slate-50" onClick={reset}>{copy.reset}</Button>{writingStep !== 'submit' && <Button className="bg-slate-950 hover:bg-slate-800" onClick={() => setWritingStep(nextWritingStep(writingStep))}>{copy.nextStep}</Button>}</div></Card><Card><p className="text-xs font-bold uppercase tracking-widest text-blue-600">{copy.structuredSelfCheck}</p><div className="mt-4 space-y-3">{(task === 'task1' ? ['Purpose + relationship', 'Cover every bullet point', 'Polite opening and closing', 'Check 120+ words'] : ['Position + two main points', 'Develop each paragraph', 'Example + conclusion', 'Check 250+ words']).map((item, index) => <div key={item} className="flex gap-3 rounded-xl bg-slate-50 p-3"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white text-xs font-bold text-blue-700">{index + 1}</span><span className="text-sm font-semibold text-slate-700">{item}</span></div>)}</div><p className="mt-5 text-xs text-slate-400">{copy.localAutosave}</p></Card></div>
    </>}
  </StudentShell>;
}
