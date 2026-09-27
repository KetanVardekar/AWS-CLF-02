import { Link } from 'react-router-dom';
import { CATEGORIES, QUESTIONS_BY_CATEGORY } from '../data/categories';
import { loadScore } from '../components/QuestionList';

export function Categories() {
  return (
    <>
      <h1>Practice by Category</h1>
      <p className="lead">Every question from all the exams, sorted by topic. Pick one area to focus on.</p>
      <div className="exam-grid category-grid">
        {CATEGORIES.map((c) => {
          const count = QUESTIONS_BY_CATEGORY[c.id].length;
          const score = loadScore(`clf-cat-${c.id}`);
          return (
            <Link key={c.id} to={`/categories/${c.id}`} className="exam-card">
              <strong>{c.emoji} {c.name}</strong>
              <span className="muted small">{c.blurb}</span>
              <span className="muted">{count} questions</span>
              {score && <span className="best">Last: {score.correct}/{score.answered} correct</span>}
            </Link>
          );
        })}
      </div>
    </>
  );
}
