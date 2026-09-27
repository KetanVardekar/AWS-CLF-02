import { Link } from 'react-router-dom';
import { EXAMS } from '../data/exams';
import { loadScore } from '../components/QuestionList';

export function ExamList() {
  return (
    <>
      <h1>Practice Exams</h1>
      <p className="lead">{EXAMS.length} practice exams. Click an answer to check it straight away.</p>
      <div className="exam-grid">
        {EXAMS.map((e) => {
          const score = loadScore(`clf-exam-${e.id}`);
          return (
            <Link key={e.id} to={`/exams/${e.id}`} className="exam-card">
              <strong>{e.title}</strong>
              <span className="muted">{e.questions.length} questions</span>
              {score && <span className="best">Last: {score.correct}/{score.answered} correct</span>}
            </Link>
          );
        })}
      </div>
    </>
  );
}
