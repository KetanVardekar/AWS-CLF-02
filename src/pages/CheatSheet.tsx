import { useMemo, useState } from 'react';
import { KEYWORDS } from '../data/keywords';
import { TOPICS } from '../data/topics';

export function CheatSheet() {
  const [filter, setFilter] = useState('');
  const [quiz, setQuiz] = useState(false);
  const [revealed, setRevealed] = useState<Set<string>>(new Set());

  const groups = useMemo(() => {
    const f = filter.trim().toLowerCase();
    const match = (text: string) => text.toLowerCase().includes(f);
    return TOPICS.map((t) => ({
      topic: t,
      rows: KEYWORDS.filter(
        (k) => k.topic === t.id && (!f || match(k.keyword) || match(k.thinkOf) || match(k.meaning) || k.synonyms?.some(match)),
      ),
    })).filter((g) => g.rows.length);
  }, [filter]);

  const toggleQuiz = () => {
    setQuiz((q) => !q);
    setRevealed(new Set());
  };

  const reveal = (id: string) =>
    setRevealed((s) => {
      const next = new Set(s);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <>
      <h1>CLF-C02 Keyword → Concept → Answer</h1>
      <p className="lead">See the keyword in the question, think of the AWS service, pick the answer.</p>

      <div className="sheet-tools">
        <input
          className="search"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Filter… e.g. DDoS, queue, temporary credentials"
          aria-label="Filter the cheat sheet"
        />
        <label className="switch">
          <input type="checkbox" checked={quiz} onChange={toggleQuiz} />
          <span>Hide answers (self-test)</span>
        </label>
      </div>
      {quiz && <p className="hint">Say the answer, then tap a row to check it.</p>}

      <nav className="toc">
        {groups.map(({ topic }) => (
          <a key={topic.id} href={`#${topic.id}`} onClick={(e) => { e.preventDefault(); document.getElementById(topic.id)?.scrollIntoView({ behavior: 'smooth' }); }}>
            {topic.emoji} {topic.name}
          </a>
        ))}
      </nav>

      {groups.map(({ topic, rows }) => (
        <section key={topic.id} id={topic.id} className="topic">
          <h2>{topic.emoji} {topic.name}</h2>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Keyword / phrase</th>
                  <th>Think of</th>
                  <th>Answer / meaning</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((k) => {
                  const hidden = quiz && !revealed.has(k.id);
                  return (
                    <tr key={k.id} className={quiz ? 'clickable' : ''} onClick={quiz ? () => reveal(k.id) : undefined}>
                      <td>{k.keyword}</td>
                      <td className={`concept ${hidden ? 'hidden' : quiz ? 'revealed' : ''}`}>{k.thinkOf}</td>
                      <td className={hidden ? 'hidden' : quiz ? 'revealed' : ''}>{k.meaning}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      ))}

      {!groups.length && <p className="muted">No matches for “{filter}”.</p>}
    </>
  );
}
