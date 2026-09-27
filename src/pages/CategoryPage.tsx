import { useMemo, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { CATEGORIES, QUESTIONS_BY_CATEGORY } from '../data/categories';
import { QuestionList } from '../components/QuestionList';

function shuffled<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function CategoryPage() {
  const { id } = useParams();
  const category = CATEGORIES.find((c) => c.id === id);
  const [order, setOrder] = useState(0);
  const all = category ? QUESTIONS_BY_CATEGORY[category.id] : [];
  const questions = useMemo(() => (order ? shuffled(all) : all), [all, order]);

  if (!category) return <Navigate to="/categories" replace />;

  return (
    <>
      <Link to="/categories" className="back">← All categories</Link>
      <div className="title-row">
        <h1>{category.emoji} {category.name}</h1>
        <button className="btn btn-ghost" onClick={() => setOrder((o) => o + 1)}>🔀 Shuffle</button>
      </div>
      <QuestionList key={`${category.id}-${order}`} questions={questions} storageKey={`clf-cat-${category.id}`} />
    </>
  );
}
