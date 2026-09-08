import { Fragment, useMemo } from 'react';
import { parseInline } from './utils';

export function RichText({ text }: { text: string }) {
  const tokens = useMemo(() => parseInline(text), [text]);
  return (
    <>
      {tokens.map((t, i) => {
        if (t.kind === 'bold') {
          return (
            <strong key={i} className="font-semibold text-slate-900">
              {t.value}
            </strong>
          );
        }
        if (t.kind === 'italic') {
          return (
            <em key={i} className="font-medium not-italic text-blue-700">
              {t.value}
            </em>
          );
        }
        return <Fragment key={i}>{t.value}</Fragment>;
      })}
    </>
  );
}
