import { useEffect, useRef, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import exams from '../data/exams.json';
import type { Exam, ExamQuestion } from '../data/types';

const LETTERS = 'ABCDEF';
const PASS_PCT = 70;

interface Score {
  answered: number;
  correct: number;
}

export function loadScore(id: number): Score | null {
  try {
    const raw = localStorage.getItem(`clf-exam-${id}`);
    return raw ? (JSON.parse(raw) as Score) : null;
  } catch {
    return null;
  }
}

export function ExamPage() {
  const { id } = useParams();
  const exam = (exams as Exam[]).find((e) => String(e.id) === id);
  // Result per question index: true = correct, false = wrong
  const [results, setResults] = useState<Record<number, boolean>>({});
  const [streak, setStreak] = useState(0);
  const [attempt, setAttempt] = useState(0);
  // Each question registers its pick handler so the keyboard can answer the active one.
  const choosers = useRef<Record<number, (option: number) => void>>({});
  const scrollOnAnswer = useRef(false);

  const total = exam?.questions.length ?? 0;
  const answered = Object.keys(results).length;
  const correct = Object.values(results).filter(Boolean).length;
  const finished = total > 0 && answered === total;
  const pct = answered ? Math.round((correct / answered) * 100) : 0;
  let active = 0;
  while (active < total && active in results) active++;

  useEffect(() => {
    if (!exam || !answered) return;
    try {
      localStorage.setItem(`clf-exam-${exam.id}`, JSON.stringify({ answered, correct }));
    } catch {
      /* ignore */
    }
  }, [exam, answered, correct]);

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

  if (!exam) return <Navigate to="/exams" replace />;

  const onResult = (i: number, ok: boolean) => {
    setResults((r) => ({ ...r, [i]: ok }));
    setStreak((s) => (ok ? s + 1 : 0));
  };

  const reset = () => {
    setResults({});
    setStreak(0);
    setAttempt((a) => a + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const barState = finished ? (pct >= PASS_PCT ? 'pass' : 'fail') : '';

  return (
    <>
      <Link to="/exams" className="back">← All exams</Link>
      <h1>{exam.title}</h1>
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
          <div className={`progress-fill ${barState}`} style={{ width: `${(answered / total) * 100}%` }} />
        </div>
      </div>

      <ol className="questions" key={attempt}>
        {exam.questions.map((q, i) => (
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
    </li>
  );
}
