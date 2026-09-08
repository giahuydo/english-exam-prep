import type { InterviewQuestion } from './data';

export type Token = { kind: 'text' | 'bold' | 'italic'; value: string };
export type InlineToken = Token & { sourceStart: number; sourceEnd: number };

export function parseInlineRanges(text: string): InlineToken[] {
  const tokens: InlineToken[] = [];
  const re = /\*\*([^*]+)\*\*|\*([^*]+)\*/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) tokens.push({ kind: 'text', value: text.slice(last, m.index), sourceStart: last, sourceEnd: m.index });
    const value = m[1] ?? m[2] ?? '';
    const kind = m[1] !== undefined ? 'bold' : 'italic';
    const sourceStart = m.index + (m[1] !== undefined ? 2 : 1);
    tokens.push({ kind, value, sourceStart, sourceEnd: sourceStart + value.length });
    last = m.index + m[0].length;
  }
  if (last < text.length) tokens.push({ kind: 'text', value: text.slice(last), sourceStart: last, sourceEnd: text.length });
  return tokens;
}

export function parseInline(text: string): Token[] {
  return parseInlineRanges(text).map(({ kind, value }) => ({ kind, value }));
}

export function stripFormatting(text: string): string {
  return text.replace(/\*\*([^*]+)\*\*/g, '$1').replace(/\*([^*]+)\*/g, '$1').replace(/\//g, ' ').replace(/\s+/g, ' ').trim();
}

export function extractKeywords(text: string): string[] {
  const re = /\*\*([^*]+)\*\*/g;
  const out: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    const chunk = m[1];
    if (chunk) out.push(...chunk.split(/,\s*|\s+or\s+/).map((s) => s.trim()).filter(Boolean));
  }
  return out;
}

export function extractStarter(text: string): string | null {
  const m = text.match(/\*([^*]+)\*/);
  return m && m[1] ? m[1].trim().replace(/[,\s]+$/, '') : null;
}

export function questionKeywords(q: InterviewQuestion): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const p of q.answer.sections) {
    for (const k of extractKeywords(p.en)) {
      const key = k.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        out.push(k);
      }
    }
  }
  return out;
}

export function questionStarters(q: InterviewQuestion): string[] {
  return q.answer.sections
    .map((p) => extractStarter(p.en))
    .filter((s): s is string => Boolean(s));
}

export function mindMapSteps(context: string): string[] {
  const afterColon = context.includes(':') ? context.slice(context.indexOf(':') + 1) : context;
  return afterColon
    .split('→')
    .map((s) => s.trim())
    .filter(Boolean);
}

export function clozeText(text: string): { before: string; hidden: string; after: string } | null {
  const match = text.match(/\*\*([^*]+)\*\*/);
  if (!match || match.index === undefined) return null;
  return { before: text.slice(0, match.index), hidden: match[1], after: text.slice(match.index + match[0].length) };
}

export function contextCode(context: string): string {
  const m = context.match(/Context\s+([A-Z/]+)/);
  return m && m[1] ? m[1] : '';
}
