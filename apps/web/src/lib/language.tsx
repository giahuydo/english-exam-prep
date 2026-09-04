'use client';

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

export type LearnerLanguage = 'en' | 'vi';
const STORAGE_KEY = 'learner-language';

const LanguageContext = createContext<{
  language: LearnerLanguage;
  setLanguage: (language: LearnerLanguage) => void;
}>({ language: 'en', setLanguage: () => undefined });

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<LearnerLanguage>('en');

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === 'en' || saved === 'vi') setLanguageState(saved);
  }, []);

  function setLanguage(next: LearnerLanguage) {
    setLanguageState(next);
    window.localStorage.setItem(STORAGE_KEY, next);
  }

  const value = useMemo(() => ({ language, setLanguage }), [language]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  return useContext(LanguageContext);
}

export const learnerCopy = {
  en: {
    today: 'Today', learn: 'Learn', practice: 'Practice', vocabulary: 'Vocabulary', mocks: 'Mock exams', mistakes: 'Mistakes',
    workspace: 'Workspace', streak: 'Study streak', logout: 'Log out',
    questionProgress: 'Question progress', passage: 'Passage', question: 'Question',
    needHint: 'Need a hint?', revealHint: (n: number) => `Reveal hint ${n}`, hint: (n: number) => `Hint ${n}`,
    submitAnswer: 'Submit answer', checking: 'Checking…', correct: 'Correct', incorrect: 'Incorrect',
    niceWork: 'Nice work — your answer is correct.', review: 'Let’s learn from this answer.', why: 'Why',
    rule: 'Rule / structure', example: 'Example', commonMistake: 'Common mistake', otherAnswers: 'Why the other answers do not work',
    correctAnswer: 'Correct answer', next: 'Next question →', result: 'See result →',
  },
  vi: {
    today: 'Hôm nay', learn: 'Học', practice: 'Luyện tập', vocabulary: 'Từ vựng', mocks: 'Đề thi thử', mistakes: 'Cần ôn lại',
    workspace: 'Khu học tập', streak: 'Chuỗi ngày học', logout: 'Đăng xuất',
    questionProgress: 'Tiến độ câu hỏi', passage: 'Đoạn văn', question: 'Câu hỏi',
    needHint: 'Cần gợi ý?', revealHint: (n: number) => `Xem gợi ý ${n}`, hint: (n: number) => `Gợi ý ${n}`,
    submitAnswer: 'Nộp câu trả lời', checking: 'Đang kiểm tra…', correct: 'Đúng', incorrect: 'Chưa đúng',
    niceWork: 'Tốt lắm — câu trả lời của bạn chính xác.', review: 'Hãy cùng rút kinh nghiệm từ câu này.', why: 'Vì sao',
    rule: 'Quy tắc / cấu trúc', example: 'Ví dụ', commonMistake: 'Lỗi thường gặp', otherAnswers: 'Vì sao các đáp án khác chưa phù hợp',
    correctAnswer: 'Đáp án đúng', next: 'Câu tiếp theo →', result: 'Xem kết quả →',
  },
} as const;
