import type { ExamQuestion } from './types';
import { EXAMS } from './exams';
import categoryMap from './question-categories.json';

export { CATEGORIES } from './category-list';
export type { Category } from './category-list';
import { CATEGORIES } from './category-list';

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

/** Stable id from the question text, so regenerating exams.json keeps categories. */
export function questionKey(q: ExamQuestion): string {
  const text = norm(q.question) + '|' + norm(q.options.join('|'));
  let h = 0x811c9dc5;
  for (const c of text) {
    h ^= c.charCodeAt(0);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h.toString(36);
}

const MAP = categoryMap as Record<string, string>;

/** Unique questions per category (the same question can appear in several exams). */
export const QUESTIONS_BY_CATEGORY: Record<string, ExamQuestion[]> = (() => {
  const out: Record<string, ExamQuestion[]> = Object.fromEntries(CATEGORIES.map((c) => [c.id, []]));
  const seen = new Set<string>();
  for (const exam of EXAMS) {
    for (const q of exam.questions) {
      const key = questionKey(q);
      if (seen.has(key)) continue;
      seen.add(key);
      out[MAP[key] ?? 'other'].push(q);
    }
  }
  return out;
})();
