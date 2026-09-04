export type WritingStep = 'understand' | 'outline' | 'draft' | 'checklist' | 'submit';
export function countWords(text: string): number { const value = text.trim(); return value ? value.split(/\s+/).length : 0; }
export function formatClock(seconds: number): string { const safe = Math.max(0, Math.floor(seconds)); return `${String(Math.floor(safe / 60)).padStart(2, '0')}:${String(safe % 60).padStart(2, '0')}`; }
export function nextWritingStep(step: WritingStep): WritingStep { const steps: WritingStep[] = ['understand', 'outline', 'draft', 'checklist', 'submit']; return steps[Math.min(steps.indexOf(step) + 1, steps.length - 1)]; }
export function recordingSupport(mediaRecorderAvailable: boolean, permissionGranted: boolean): 'ready' | 'unavailable' | 'permission-denied' { return !mediaRecorderAvailable ? 'unavailable' : !permissionGranted ? 'permission-denied' : 'ready'; }
