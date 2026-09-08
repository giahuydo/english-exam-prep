import type { InterviewQuestion } from './data';

export type Token = { kind: 'text' | 'bold' | 'italic'; value: string };

export function parseInline(text: string): Token[] {
  const tokens: Token[] = [];
  const re = /\*\*([^*]+)\*\*|\*([^*]+)\*/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) tokens.push({ kind: 'text', value: text.slice(last, m.index) });
    if (m[1] !== undefined) tokens.push({ kind: 'bold', value: m[1] });
    else if (m[2] !== undefined) tokens.push({ kind: 'italic', value: m[2] });
    last = m.index + m[0].length;
  }
  if (last < text.length) tokens.push({ kind: 'text', value: text.slice(last) });
  return tokens;
}

export function stripFormatting(text: string): string {
  return text.replace(/\*\*([^*]+)\*\*/g, '$1').replace(/\*([^*]+)\*/g, '$1');
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
  for (const p of q.paragraphs) {
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
  return q.paragraphs
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
