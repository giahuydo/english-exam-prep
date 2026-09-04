'use client';

import { useState } from 'react';
import { Badge, Card, SectionTitle } from '@/components/ui';
import { StrategyDrill } from '@/components/strategy-drill';
import { StudentShell } from '@/components/shells';
import { useLanguage } from '@/lib/language';
import { VSTEP_MEMORY_MAP } from '@/lib/exam-format';

export default function StrategyDrillsPage() {
  const { language } = useLanguage(); const vi = language === 'vi'; const [mode, setMode] = useState<'reading' | 'listening'>('reading'); const section = VSTEP_MEMORY_MAP.find((item) => item.code === mode.toUpperCase())!;
  return <StudentShell><SectionTitle eyebrow="VSTEP B1/B2 strategy" title={vi ? 'Luyện nhận diện dạng bài' : 'Recognize the pattern, then solve'} description={vi ? 'Luyện ngắn để biến cấu trúc đề và chiến lược thành phản xạ.' : 'Short drills turn exam structure and strategy into a recallable routine.'} action={<Badge tone="blue">{vi ? 'Nội dung học thuật bằng tiếng Anh' : 'Academic English content'}</Badge>} /><Card className="mb-5 border-violet-200 bg-violet-50/50"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-widest text-violet-700">Exam-pattern memory</p><h2 className="mt-2 text-lg font-bold">{vi ? 'Chọn kỹ năng cần luyện chiến lược' : 'Choose a strategy lane'}</h2><p className="mt-1 text-sm text-slate-600">{section.time} · {section.shape}</p></div><div className="flex gap-2">{(['reading', 'listening'] as const).map((item) => <button key={item} type="button" onClick={() => setMode(item)} className={`rounded-xl border px-4 py-2 text-sm font-bold ${mode === item ? 'border-violet-600 bg-violet-600 text-white' : 'border-slate-200 bg-white text-slate-700'}`}>{item === 'reading' ? (vi ? 'Đọc' : 'Reading') : (vi ? 'Nghe' : 'Listening')}</button>)}</div></div></Card><StrategyDrill mode={mode} /><p className="mt-5 text-xs text-slate-400">{vi ? 'Các bài luyện dùng nội dung tổng hợp để luyện chiến lược, không phải đề thi chính thức.' : 'Drills use synthetic practice content for strategy training; they are not official exam papers.'}</p></StudentShell>;
}
