'use client';

import Link from 'next/link';
import { Badge, Card } from './ui';
import { learnerCopy, useLanguage } from '@/lib/language';
import { intervalLabel, suggestedInterval, type AnswerSignal } from '@/lib/adaptive-review';

export function AdaptiveReviewPanel({ signals }: { signals: AnswerSignal[] }) {
  const { language } = useLanguage();
  const vi = language === 'vi';
  const due = signals.filter((signal) => suggestedInterval(signal) === 'today').slice(0, 5);
  const lowConfidence = signals.filter((signal) => signal.confidence !== 'Know').length;
  if (!signals.length) return <Card><p className="text-xs font-bold uppercase tracking-widest text-blue-600">{vi ? 'Hàng đợi ghi nhớ' : 'Retention queue'}</p><h2 className="mt-2 text-lg font-bold">{vi ? 'Chưa có tín hiệu ôn tập' : 'Your review signals will appear here'}</h2><p className="mt-2 text-sm leading-6 text-slate-500">{vi ? 'Sau mỗi câu trả lời, hãy đánh dấu mức tự tin để ưu tiên ôn tập phù hợp.' : 'After each answer, mark your confidence so review can prioritize what needs attention.'}</p><Link className="mt-4 inline-block text-sm font-semibold text-blue-700" href="/practice">{vi ? 'Luyện 5 câu →' : 'Practice 5 questions →'}</Link></Card>;
  return <Card><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-widest text-blue-600">{vi ? 'Hàng đợi ghi nhớ' : 'Retention queue'}</p><h2 className="mt-2 text-lg font-bold">{due.length ? (vi ? `${due.length} mục nên ôn hôm nay` : `${due.length} items to review today`) : (vi ? 'Đang theo dõi tiến bộ' : 'Review plan is building')}</h2></div><Badge tone={lowConfidence ? 'amber' : 'green'}>{lowConfidence} {vi ? 'chưa chắc' : 'low-confidence'}</Badge></div><div className="mt-4 space-y-2">{signals.slice(0, 4).map((signal) => { const interval = suggestedInterval(signal); const reason = !signal.correct ? (vi ? 'sai + cần củng cố' : 'incorrect + reinforce') : signal.confidence === 'Guess' ? (vi ? 'đoán + cần ôn lại' : 'guessed + review') : signal.confidence === 'Unsure' ? (vi ? 'chưa chắc + kiểm tra lại' : 'unsure + check again') : (vi ? 'đúng + duy trì' : 'correct + maintain'); return <div key={signal.questionId} className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3"><div><p className="text-sm font-semibold">{signal.topic?.name ?? (vi ? 'Kỹ năng VSTEP' : 'VSTEP skill')}</p><p className="mt-1 text-xs text-slate-500">{vi ? 'ôn tập vì: ' : 'review because: '}{reason}</p></div><span className="shrink-0 rounded-full bg-white px-2 py-1 text-[11px] font-bold text-slate-600">{intervalLabel(interval, vi)}</span></div>; })}</div><Link className="mt-4 inline-block text-sm font-semibold text-blue-700" href="/mistakes">{vi ? 'Mở Review →' : 'Open Review →'}</Link></Card>;
}
