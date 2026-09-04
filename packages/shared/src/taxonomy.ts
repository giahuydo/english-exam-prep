/**
 * Learner-facing exam taxonomy.
 *
 * VSTEP is the exam framework; B1/B2 describe the learner's target
 * proficiency. HCMUS is an orientation/source context, not a second skill
 * framework and is not presented as equivalent to VSTEP.
 */
export const LEARNER_TARGET_LEVELS = ['B1', 'B2'] as const;
export type LearnerTargetLevel = (typeof LEARNER_TARGET_LEVELS)[number];

export const PRIMARY_EXAM_CODE = 'VSTEP' as const;
export const HCMUS_CONTEXT_CODE = 'HCMUS_MASTER_ENTRANCE' as const;

export function learnerExamLabel(code: string, name?: string | null): string {
  if (code === PRIMARY_EXAM_CODE) return 'VSTEP 3-5';
  if (code === HCMUS_CONTEXT_CODE) return 'HCMUS-oriented practice';
  if (code === 'B1') return 'VSTEP B1';
  if (code === 'B2') return 'VSTEP B2';
  return name ?? code;
}

export function learnerTargetLabel(level: LearnerTargetLevel): string {
  return `VSTEP ${level}`;
}

export function isHcmusContext(code?: string | null): boolean {
  return code === HCMUS_CONTEXT_CODE;
}

/** Keep source/context names visible without presenting HCMUS as a VSTEP exam. */
export function learnerBlueprintTitle(code: string, name: string): string {
  if (!isHcmusContext(code)) return name;
  return name.replace(/HCMUS Master( Entrance)?/i, 'HCMUS-oriented');
}
