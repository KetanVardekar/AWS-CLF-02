import { useEffect, useRef, useState } from 'react';
import type { ExamQuestion } from '../data/types';

const LETTERS = 'ABCDEF';
const PASS_PCT = 70;

interface Score {
  answered: number;
  correct: number;
}

export function loadScore(storageKey: string): Score | null {
  try {
    const raw = localStorage.getItem(storageKey);
    return raw ? (JSON.parse(raw) as Score) : null;
  } catch {
    return null;
  }
}

/** "Last try" summary for exam/category cards: accuracy on answered questions plus how far the user got. */
export function LastScore({ storageKey, total }: { storageKey: string; total: number }) {
  const score = loadScore(storageKey);
  if (!score || !score.answered) return null;
  const pct = Math.round((score.correct / score.answered) * 100);
  const finished = score.answered >= total;
  return (
    <span className={`last-score ${pct >= PASS_PCT ? 'good' : 'bad'}`}>
      Last try: {score.correct}/{score.answered} correct ({pct}%)
      <span className="muted"> · {finished ? 'finished' : `answered ${score.answered} of ${total}`}</span>
    </span>
  );
}

/**
 * A practice list: instant feedback per question, score bar, streak,
 * progress bar and keyboard answering. Used by exams and categories.
 */
export function QuestionList({ questions, storageKey }: { questions: ExamQuestion[]; storageKey: string }) {
  // Result per question index: true = correct, false = wrong
  const [results, setResults] = useState<Record<number, boolean>>({});
  const [streak, setStreak] = useState(0);
  const [attempt, setAttempt] = useState(0);
  // Each question registers its pick handler so the keyboard can answer the active one.
  const choosers = useRef<Record<number, (option: number) => void>>({});
  const scrollOnAnswer = useRef(false);

  const total = questions.length;
  const answered = Object.keys(results).length;
  const correct = Object.values(results).filter(Boolean).length;
  const finished = total > 0 && answered === total;
  const pct = answered ? Math.round((correct / answered) * 100) : 0;
  let active = 0;
  while (active < total && active in results) active++;

  useEffect(() => {
    if (!answered) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify({ answered, correct }));
    } catch {
      /* ignore */
    }
  }, [storageKey, answered, correct]);

  // Keys 1–6 / A–F answer the first unanswered question.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey || (e.target as HTMLElement).tagName === 'INPUT') return;
      const k = e.key.toLowerCase();
      const option = /^[1-6]$/.test(k) ? Number(k) - 1 : /^[a-f]$/.test(k) ? k.charCodeAt(0) - 97 : -1;
      if (option < 0 || active >= total) return;
      scrollOnAnswer.current = true;
      choosers.current[active]?.(option);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [active, total]);

  // After a keyboard answer, bring the next question into view.
  useEffect(() => {
    if (!scrollOnAnswer.current) return;
    scrollOnAnswer.current = false;
    const t = setTimeout(() => {
      document.getElementById(`q-${active}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 600);
    return () => clearTimeout(t);
  }, [active]);

  const onResult = (i: number, ok: boolean) => {
    setResults((r) => ({ ...r, [i]: ok }));
    setStreak((s) => (ok ? s + 1 : 0));
  };

  const reset = () => {
    try {
      localStorage.removeItem(storageKey);
    } catch {
      /* ignore */
    }
    setResults({});
    setStreak(0);
    setAttempt((a) => a + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const barState = finished ? (pct >= PASS_PCT ? 'pass' : 'fail') : '';

  return (
    <>
      <p className="lead">Click an answer, or press <kbd>1</kbd>–<kbd>4</kbd> / <kbd>A</kbd>–<kbd>D</kbd> to answer the next question.</p>

      <div className="scorebar">
        <div className="scorebar-row">
          <span>Answered <strong>{answered}</strong> / {total}</span>
          <span className="good">✓ {correct}</span>
          <span className="bad">✗ {answered - correct}</span>
          {streak >= 2 && <span key={streak} className="streak">🔥 {streak} in a row</span>}
          <button className="btn" onClick={reset}>Reset</button>
        </div>
        <div className="progress" title={`Pass mark ${PASS_PCT}%`}>
          <div className={`progress-fill ${barState}`} style={{ width: `${total ? (answered / total) * 100 : 0}%` }} />
        </div>
      </div>

      <ol className="questions" key={attempt}>
        {questions.map((q, i) => (
          <QuestionItem
            key={i}
            index={i}
            q={q}
            active={i === active}
            register={(fn) => (choosers.current[i] = fn)}
            onResult={(ok) => onResult(i, ok)}
          />
        ))}
      </ol>

      {finished && (
        <div className={`final ${pct >= PASS_PCT ? 'pass' : 'fail'}`}>
          <h2>{pct >= PASS_PCT ? '🎉 Passed' : 'Keep practising'}: {correct} / {total} ({pct}%)</h2>
          <p className="muted">Pass mark is about {PASS_PCT}%.</p>
          <button className="btn" onClick={reset}>Try again</button>
        </div>
      )}
    </>
  );
}

interface ItemProps {
  index: number;
  q: ExamQuestion;
  active: boolean;
  register: (choose: (option: number) => void) => void;
  onResult: (ok: boolean) => void;
}

function QuestionItem({ index, q, active, register, onResult }: ItemProps) {
  const need = q.answer.length;
  const [picked, setPicked] = useState<number[]>([]);
  const [done, setDone] = useState(false);
  const [anim, setAnim] = useState<'' | 'shake' | 'pulse'>('');

  const choose = (i: number) => {
    if (done || picked.includes(i) || i >= q.options.length) return;
    const next = [...picked, i];
    setPicked(next);
    if (next.length < need) return;

    const ok = next.every((p) => q.answer.includes(p));
    setDone(true);
    onResult(ok);
    setAnim(ok ? 'pulse' : 'shake');
    if (!ok) navigator.vibrate?.(200);
    setTimeout(() => setAnim(''), 500);
  };

  useEffect(() => {
    register(choose);
  });

  const ok = done && picked.every((p) => q.answer.includes(p));

  return (
    <li id={`q-${index}`} className={`question ${anim} ${done ? (ok ? 'is-right' : 'is-wrong') : ''} ${active ? 'active' : ''}`}>
      <p className="q-text">{q.question}</p>
      {need > 1 && !done && <p className="hint">Select {need} answers</p>}
      <div className="options">
        {q.options.map((opt, i) => {
          const isPicked = picked.includes(i);
          const isAnswer = q.answer.includes(i);
          const state = done ? (isAnswer ? 'right' : isPicked ? 'wrong' : 'dim') : isPicked ? 'picked' : '';
          return (
            <button key={i} className={`option ${state}`} onClick={() => choose(i)} disabled={done}>
              <span className="letter">{LETTERS[i]}</span>
              <span>{opt}</span>
            </button>
          );
        })}
      </div>
      {done && (
        <p className="result">
          {ok ? '✅ Correct' : `❌ Correct answer: ${q.answer.map((a) => LETTERS[a]).join(', ')}`}
          {q.link && (
            <>
              {' · '}
              <a href={q.link} target="_blank" rel="noreferrer">Reference</a>
            </>
          )}
        </p>
      )}
      {done && q.explanation && <p className="why">💡 {q.explanation}</p>}
    </li>
  );
}
