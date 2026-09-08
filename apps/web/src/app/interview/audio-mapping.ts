export type SpeechMapping = { text: string; speechToCanonical: number[] };

export function buildSpeechMapping(canonical: string): SpeechMapping {
  const text: string[] = [];
  const speechToCanonical: number[] = [];
  for (let index = 0; index < canonical.length; index += 1) {
    if (canonical[index] === '*') continue;
    text.push(canonical[index] === '/' ? ' ' : canonical[index]);
    speechToCanonical.push(index);
  }
  return { text: text.join('').replace(/\s+$/g, ''), speechToCanonical };
}
