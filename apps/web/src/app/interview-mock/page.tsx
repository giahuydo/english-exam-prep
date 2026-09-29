'use client';

import { useEffect, useRef, useState } from 'react';
import { Card, SectionTitle } from '@/components/ui';
import { StudentShell } from '@/components/shells';
import { learnerCopy, useLanguage } from '@/lib/language';
import { speakingChunks } from '@/app/interview/backend/speaking-chunks';
import questions from './questions.json';

export default function InterviewMockPage() {
  const { language } = useLanguage();
  const copy = learnerCopy[language];
  const [activeQuestion, setActiveQuestion] = useState<number | null>(null);
  const [showTranslation, setShowTranslation] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const active = activeQuestion === null ? null : questions[activeQuestion];

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (activeQuestion === null) dialog.close();
    else dialog.showModal();
  }, [activeQuestion]);

  return (
    <StudentShell>
      <SectionTitle
        eyebrow={copy.assessmentMode}
        title={copy.interviewMock}
        description={
          language === 'vi'
            ? 'Chọn một câu để xem toàn bộ câu trả lời mẫu. Chỉ dùng dữ liệu trên giao diện.'
            : 'Select a question to read the full sample answer. Frontend-only data.'
        }
      />
      <Card className="max-w-4xl p-4 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-slate-950">
            {language === 'vi' ? 'Câu hỏi phỏng vấn' : 'Interview questions'}
          </h2>
          <span className="text-sm font-semibold text-slate-500">
            {copy.questions(questions.length)}
          </span>
        </div>
        <div
          className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3 lg:grid-cols-3"
          aria-label={language === 'vi' ? 'Lưới câu hỏi' : 'Question grid'}
        >
          {questions.map((question, questionIndex) => (
            <button
              key={question.label}
              type="button"
              onClick={() => {
                setShowTranslation(false);
                setActiveQuestion(questionIndex);
              }}
              className="flex min-h-28 flex-col rounded-xl border border-slate-200 bg-white p-3 text-left transition hover:border-blue-400 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <span className="text-xs font-bold text-blue-700">
                {copy.questionNumber(questionIndex + 1)}
              </span>
              <span className="mt-2 text-lg font-bold leading-6 text-slate-900">
                {question.label}
              </span>
              {question.keywords && (
                <span className="mt-3 flex flex-wrap gap-1.5">
                  {question.keywords.map((keyword) => (
                    <span
                      key={keyword}
                      className="rounded-md bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-600"
                    >
                      {keyword}
                    </span>
                  ))}
                </span>
              )}
            </button>
          ))}
        </div>
      </Card>
      <dialog
        ref={dialogRef}
        onClose={() => setActiveQuestion(null)}
        onClick={(event) => {
          if (event.target === event.currentTarget) setActiveQuestion(null);
        }}
        aria-label={activeQuestion === null ? undefined : copy.questionNumber(activeQuestion + 1)}
        className="max-h-[calc(100dvh-2rem)] w-[calc(100%-1.5rem)] max-w-3xl overflow-y-auto rounded-2xl border border-slate-200 bg-white p-0 shadow-2xl backdrop:bg-slate-950/60"
      >
        {active && activeQuestion !== null && (
          <div className="p-4 sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <span className="text-xs font-bold uppercase tracking-widest text-blue-700">
                {copy.questionNumber(activeQuestion + 1)} / {questions.length}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-pressed={showTranslation}
                  onClick={() => setShowTranslation((current) => !current)}
                  className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-bold text-slate-600 hover:border-blue-300 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {showTranslation ? 'EN' : 'VI'}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveQuestion(null)}
                  aria-label={language === 'vi' ? 'Đóng' : 'Close'}
                  className="rounded-lg px-2 text-xl text-slate-500 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  ×
                </button>
              </div>
            </div>
            <h2 className="mt-3 text-lg font-bold leading-7 text-slate-950 sm:text-xl">
              {active.prompt}
            </h2>
            {active.alternative && (
              <p className="mt-2 text-sm italic text-slate-500">{active.alternative}</p>
            )}
            <div className="mt-5 rounded-md border-l-[5px] border-[#f59f00] bg-[#fff3bf] px-4 py-3 text-[#111827]">
              <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[#374151]">
                {showTranslation
                  ? 'Bản dịch tiếng Việt'
                  : language === 'vi'
                    ? 'Câu trả lời mẫu'
                    : 'Sample answer'}
              </p>
              <div className="space-y-3 text-[18px] font-bold leading-[1.55]">
                {(showTranslation ? active.translate : active.answer)
                  .split('\n\n')
                  .map((paragraph, paragraphIndex) => (
                    <div key={paragraphIndex} className="flex flex-wrap gap-2">
                      {speakingChunks(paragraph)
                        .flatMap((sentence) =>
                          sentence.split(
                            /(?=\s(?:because|with|but|so|while|where|which|when|instead of)\b)/i,
                          ),
                        )
                        .filter((chunk) => chunk.trim())
                        .map((chunk, chunkIndex) => (
                          <span
                            key={chunkIndex}
                            className="rounded-md border border-amber-200 bg-white/70 px-2.5 py-1 text-[#111827]"
                          >
                            {chunk.trim()}
                          </span>
                        ))}
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </dialog>
    </StudentShell>
  );
}
