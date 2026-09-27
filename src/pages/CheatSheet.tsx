import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { KEYWORDS } from '../data/keywords';
import { TOPICS, TOPIC_SYLLABUS } from '../data/topics';
import { DOMAINS } from '../data/syllabus';

const scrollTo = (id: string) => (e: React.MouseEvent) => {
  e.preventDefault();
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
};

export function CheatSheet() {
  const [filter, setFilter] = useState('');
  const [quiz, setQuiz] = useState(false);
  const [revealed, setRevealed] = useState<Set<string>>(new Set());

  // Topics grouped under the four official exam domains, filtered by the search box.
  const domains = useMemo(() => {
    const f = filter.trim().toLowerCase();
    const match = (text: string) => text.toLowerCase().includes(f);
    return DOMAINS.map((d) => ({
      domain: d,
      topics: TOPIC_SYLLABUS.filter((s) => s.domain === d.id)
        .map((s) => ({
          topic: TOPICS.find((t) => t.id === s.topic)!,
          tasks: s.tasks,
          rows: KEYWORDS.filter(
            (k) => k.topic === s.topic && (!f || match(k.keyword) || match(k.thinkOf) || match(k.meaning) || k.synonyms?.some(match)),
          ),
        }))
        .filter((g) => g.rows.length),
    })).filter((d) => d.topics.length);
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
      <p className="lead">
        See the keyword in the question, think of the AWS service, pick the answer. Grouped by the{' '}
        <Link to="/syllabus">official exam domains</Link>.
      </p>

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

      <nav className="toc-domains">
        {domains.map(({ domain, topics }) => (
          <div key={domain.id} className={`toc-domain w${domain.id}`}>
            <a href={`#domain-${domain.id}`} className="toc-domain-name" onClick={scrollTo(`domain-${domain.id}`)}>
              Domain {domain.id} · {domain.name} <span>{domain.weight}%</span>
            </a>
            <div className="toc">
              {topics.map(({ topic }) => (
                <a key={topic.id} href={`#${topic.id}`} onClick={scrollTo(topic.id)}>
                  {topic.emoji} {topic.name}
                </a>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {domains.map(({ domain, topics }) => (
        <div key={domain.id} className={`sheet-domain w${domain.id}`}>
          <h2 id={`domain-${domain.id}`} className="sheet-domain-title">
            Domain {domain.id}: {domain.name} <span className="muted">({domain.weight}% of the exam)</span>
          </h2>
          {topics.map(({ topic, tasks, rows }) => (
            <section key={topic.id} id={topic.id} className="topic">
              <h3 className="topic-title">
                {topic.emoji} {topic.name}
                <span className="task-tags">
                  {tasks.map((t) => <span key={t} className="task-tag">Task {t}</span>)}
                </span>
              </h3>
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
        </div>
      ))}

      {!domains.length && <p className="muted">No matches for “{filter}”.</p>}
    </>
  );
}
