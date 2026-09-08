export type SpeechMapping = { text: string; speechToCanonical: number[] };

export function buildSpeechMapping(canonical: string): SpeechMapping {
  const text: string[] = [];
  const speechToCanonical: number[] = [];
  let pendingSpace: number | null = null;
  for (let index = 0; index < canonical.length; index += 1) {
    if (canonical[index] === '*') continue;
    const character = canonical[index] === '/' ? ' ' : canonical[index];
    if (/\s/.test(character)) {
      pendingSpace ??= index;
      continue;
    }
    if (pendingSpace !== null && text.length > 0) {
      text.push(' ');
      speechToCanonical.push(pendingSpace);
      pendingSpace = null;
    }
    text.push(character);
    speechToCanonical.push(index);
  }
  return { text: text.join(''), speechToCanonical };
}
