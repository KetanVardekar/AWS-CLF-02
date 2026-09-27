import { Link, Navigate, useParams } from 'react-router-dom';
import { EXAMS } from '../data/exams';
import { QuestionList } from '../components/QuestionList';

export function ExamPage() {
  const { id } = useParams();
  const exam = EXAMS.find((e) => String(e.id) === id);
  if (!exam) return <Navigate to="/exams" replace />;

  return (
    <>
      <Link to="/exams" className="back">← All exams</Link>
      <h1>{exam.title}</h1>
      <QuestionList key={exam.id} questions={exam.questions} />
    </>
  );
}
