import { Link } from 'react-router-dom';
import { EXAMS } from '../data/exams';
import { LastScore } from '../components/QuestionList';

export function ExamList() {
  return (
    <>
      <h1>Practice Exams</h1>
      <p className="lead">{EXAMS.length} practice exams. Click an answer to check it straight away.</p>
      <div className="exam-grid">
        {EXAMS.map((e) => {
          return (
            <Link key={e.id} to={`/exams/${e.id}`} className="exam-card">
              <strong>{e.title}</strong>
              <span className="muted">{e.questions.length} questions</span>
              <LastScore storageKey={`clf-exam-${e.id}`} total={e.questions.length} />
            </Link>
          );
        })}
      </div>
    </>
  );
}
