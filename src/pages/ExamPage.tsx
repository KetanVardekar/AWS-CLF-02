import { useEffect, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import exams from '../data/exams.json';
import type { Exam, ExamQuestion } from '../data/types';

const LETTERS = 'ABCDEF';

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
  const [attempt, setAttempt] = useState(0);

  const answered = Object.keys(results).length;
  const correct = Object.values(results).filter(Boolean).length;

  useEffect(() => {
    if (!exam || !answered) return;
    try {
      localStorage.setItem(`clf-exam-${exam.id}`, JSON.stringify({ answered, correct }));
    } catch {
      /* ignore */
    }
  }, [exam, answered, correct]);

  if (!exam) return <Navigate to="/exams" replace />;

  const reset = () => {
    setResults({});
    setAttempt((a) => a + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <Link to="/exams" className="back">← All exams</Link>
      <h1>{exam.title}</h1>

      <div className="scorebar">
        <span>Answered <strong>{answered}</strong> / {exam.questions.length}</span>
        <span className="good">✓ {correct}</span>
        <span className="bad">✗ {answered - correct}</span>
        <button className="btn" onClick={reset}>Reset</button>
      </div>

      <ol className="questions" key={attempt}>
        {exam.questions.map((q, i) => (
          <QuestionItem key={i} q={q} onResult={(ok) => setResults((r) => ({ ...r, [i]: ok }))} />
        ))}
      </ol>

      {answered === exam.questions.length && (
        <div className="final">
          <h2>Finished: {correct} / {exam.questions.length} ({Math.round((correct / exam.questions.length) * 100)}%)</h2>
          <button className="btn" onClick={reset}>Try again</button>
        </div>
      )}
    </>
  );
}

function QuestionItem({ q, onResult }: { q: ExamQuestion; onResult: (ok: boolean) => void }) {
  const need = q.answer.length;
  const [picked, setPicked] = useState<number[]>([]);
  const [done, setDone] = useState(false);
  const [shake, setShake] = useState(false);

  const choose = (i: number) => {
    if (done || picked.includes(i)) return;
    const next = [...picked, i];
    setPicked(next);
    if (next.length < need) return;

    const ok = next.every((p) => q.answer.includes(p));
    setDone(true);
    onResult(ok);
    if (!ok) {
      setShake(true);
      navigator.vibrate?.(200);
      setTimeout(() => setShake(false), 500);
    }
  };

  return (
    <li className={`question ${shake ? 'shake' : ''}`}>
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
          {picked.every((p) => q.answer.includes(p)) ? '✅ Correct' : `❌ Correct answer: ${q.answer.map((a) => LETTERS[a]).join(', ')}`}
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
