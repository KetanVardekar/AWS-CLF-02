import { Link } from 'react-router-dom';
import { CATEGORIES, QUESTIONS_BY_CATEGORY } from '../data/categories';
import { DOMAINS } from '../data/syllabus';
import { LastScore } from '../components/QuestionList';

export function Categories() {
  return (
    <>
      <h1>Practice by Category</h1>
      <p className="lead">
        Every question from all the exams, sorted by topic and grouped by the{' '}
        <Link to="/syllabus">official exam domains</Link>. Pick one area to focus on.
      </p>

      {DOMAINS.map((d) => {
        const cats = d.categories.map((id) => CATEGORIES.find((c) => c.id === id)!).filter(Boolean);
        const total = cats.reduce((n, c) => n + QUESTIONS_BY_CATEGORY[c.id].length, 0);
        return (
          <section key={d.id} className={`cat-domain w${d.id}`}>
            <h2 className="sheet-domain-title">
              Domain {d.id}: {d.name} <span className="muted">({d.weight}% of the exam · {total} questions)</span>
            </h2>
            <div className="exam-grid category-grid">
              {cats.map((c) => {
                const count = QUESTIONS_BY_CATEGORY[c.id].length;
                return (
                  <Link key={c.id} to={`/categories/${c.id}`} className="exam-card">
                    <strong>{c.emoji} {c.name}</strong>
                    <span className="muted small">{c.blurb}</span>
                    <span className="muted">{count} questions</span>
                    <LastScore storageKey={`clf-cat-${c.id}`} total={count} />
                  </Link>
                );
              })}
            </div>
          </section>
        );
      })}
    </>
  );
}
