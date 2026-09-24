/** Split only for display. Joining the chunks must reproduce the source verbatim. */
export function speakingChunks(answer: string): string[] {
  const chunks: string[] = [];
  // Prefer complete sentences and clauses; use a comma only when the current beat grows long.
  const boundary = /[.!?;:,](?=\s|$)/g;
  let start = 0;
  for (const match of answer.matchAll(boundary)) {
    const punctuation = match[0];
    const cut = match.index + punctuation.length;
    if (punctuation === ',' && cut - start < 65) continue;
    let end = cut;
    while (end < answer.length && /\s/.test(answer[end])) end++;
    // Avoid a dangling short phrase after a comma, but never remove text.
    if (punctuation === ',' && answer.length - end < 20) continue;
    chunks.push(answer.slice(start, end));
    start = end;
  }
  if (start < answer.length) chunks.push(answer.slice(start));
  return chunks;
}

/** Pair display chunks by sentence; translations can split clauses at different places. */
export function translatedSpeakingChunks(english: string, vietnamese: string): string[] {
  const en = speakingChunks(english);
  const vi = speakingChunks(vietnamese);
  const bySentence = (chunks: string[]) => {
    const sentences: string[][] = [];
    let current: string[] = [];
    for (const chunk of chunks) {
      current.push(chunk);
      if (/[.!?]\s*$/.test(chunk)) { sentences.push(current); current = []; }
    }
    if (current.length) sentences.push(current);
    return sentences;
  };
  const enSentences = bySentence(en);
  const viSentences = bySentence(vi);
  if (enSentences.length !== viSentences.length) throw new Error('Unpaired translation sentences');

  return enSentences.flatMap((sentence, sentenceIndex) => {
    const translation = viSentences[sentenceIndex];
    if (sentence.length === translation.length) return translation.map((chunk) => chunk.trim());
    const wholeSentence = translation.join('').trim();
    return sentence.map(() => wholeSentence);
  });
}
