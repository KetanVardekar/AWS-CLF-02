import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { DOMAINS, EXAM_FACTS, GUIDE_URL, OUT_OF_SCOPE } from '../data/syllabus';
import { CATEGORIES } from '../data/category-list';

const STORAGE_KEY = 'clf-syllabus-done';

function loadDone(): Set<string> {
  try {
    return new Set(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') as string[]);
  } catch {
    return new Set();
  }
}

export function Syllabus() {
  const [done, setDone] = useState<Set<string>>(loadDone);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...done]));
    } catch {
      /* ignore */
    }
  }, [done]);

  const toggle = (id: string) =>
    setDone((d) => {
      const next = new Set(d);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const totalTasks = DOMAINS.reduce((n, d) => n + d.tasks.length, 0);

  return (
    <>
      <h1>CLF-C02 Exam Syllabus</h1>
      <p className="lead">
        What the AWS Certified Cloud Practitioner exam covers, from the{' '}
        <a href={GUIDE_URL} target="_blank" rel="noreferrer">official AWS exam guide</a>. Tick each task as you study it.
      </p>

      <div className="facts">
        {EXAM_FACTS.map((f) => (
          <div key={f.label} className="fact">
            <span className="muted small">{f.label}</span>
            <strong>{f.value}</strong>
          </div>
        ))}
      </div>

      <div className="weights" aria-label="Domain weightings">
        {DOMAINS.map((d) => (
          <a key={d.id} href={`#domain-${d.id}`} className={`weight w${d.id}`} style={{ flexGrow: d.weight }}
            onClick={(e) => { e.preventDefault(); document.getElementById(`domain-${d.id}`)?.scrollIntoView({ behavior: 'smooth' }); }}>
            <strong>{d.weight}%</strong>
            <span>{d.name}</span>
          </a>
        ))}
      </div>

      <p className="study-progress">
        <span>Studied <strong>{done.size}</strong> of {totalTasks} tasks</span>
        <span className="progress"><span className="progress-fill pass" style={{ width: `${(done.size / totalTasks) * 100}%` }} /></span>
      </p>

      {DOMAINS.map((d) => {
        const doneHere = d.tasks.filter((t) => done.has(t.id)).length;
        return (
          <section key={d.id} id={`domain-${d.id}`} className={`domain w${d.id}`}>
            <div className="domain-head">
              <h2>Domain {d.id}: {d.name} <span className="muted">({d.weight}%)</span></h2>
              <span className="muted small">{doneHere}/{d.tasks.length} studied</span>
            </div>
            <div className="chips">
              <span className="muted small">Practise:</span>
              {d.categories.map((id) => {
                const c = CATEGORIES.find((x) => x.id === id);
                return c ? <Link key={id} to={`/categories/${id}`} className="chip">{c.emoji} {c.name}</Link> : null;
              })}
            </div>
            {d.tasks.map((t) => (
              <details key={t.id} className={`task ${done.has(t.id) ? 'done' : ''}`}>
                <summary>
                  <input
                    type="checkbox"
                    checked={done.has(t.id)}
                    onChange={() => toggle(t.id)}
                    onClick={(e) => e.stopPropagation()}
                    aria-label={`Mark task ${t.id} as studied`}
                  />
                  <span className="task-id">{t.id}</span>
                  <span>{t.title}</span>
                </summary>
                <div className="task-body">
                  <h3>Knowledge of</h3>
                  <ul>{t.knowledge.map((k) => <li key={k}>{k}</li>)}</ul>
                  <h3>Skills in</h3>
                  <ul>{t.skills.map((s) => <li key={s}>{s}</li>)}</ul>
                </div>
              </details>
            ))}
          </section>
        );
      })}

      <section className="domain">
        <h2>Not on the exam</h2>
        <p className="muted">The target candidate is <strong>not</strong> expected to do: {OUT_OF_SCOPE.join(', ')}.</p>
      </section>
    </>
  );
}
