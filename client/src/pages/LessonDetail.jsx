import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../api.js";
import CodeBlock from "../components/CodeBlock.jsx";
import Icon from "../components/Icon.jsx";

export default function LessonDetail() {
  const { id } = useParams();
  const [lesson, setLesson] = useState(null);
  const [error, setError] = useState(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    api.lesson(id).then(setLesson).catch((e) => setError(e.message));
    api.progress().then((p) => {
      const rec = p.progress.find((r) => r.id === id);
      if (rec) setDone(rec.done);
    }).catch(() => {});
  }, [id]);

  const toggleDone = async () => {
    const next = !done;
    setDone(next);
    try { await api.setProgress(id, next); } catch { setDone(!next); }
  };

  if (error) return <section className="section"><p className="error">Lesson not found ({error}). <Link to="/lessons">Back to lessons</Link></p></section>;
  if (!lesson) return <section className="section"><p>Loading…</p></section>;

  return (
    <section className="section">
      <Link to="/lessons" className="back-link">← All lessons</Link>
      <div className="detail-header">
        <span className="card-icon big"><Icon name={lesson.icon} size={42} /></span>
        <div>
          <span className="eyebrow">Lesson {lesson.order} · {lesson.level} · <Icon name="clock" size={14} /> {lesson.duration}</span>
          <h2>{lesson.title}</h2>
          <p className="section-sub">{lesson.summary}</p>
        </div>
        <button className={`btn ${done ? "btn-primary" : "btn-ghost"}`} onClick={toggleDone}>
          {done ? "✓ Completed" : "Mark complete"}
        </button>
      </div>

      <div className="detail-grid">
        <div className="panel">
          <h3><Icon name="target" size={18} /> Objectives</h3>
          <ul>{lesson.objectives.map((o, i) => <li key={i}>{o}</li>)}</ul>
        </div>
        <div className="panel">
          <h3><Icon name="book" size={18} /> Walkthrough</h3>
          <ol>{lesson.walkthrough.map((w, i) => <li key={i}>{w}</li>)}</ol>
        </div>
      </div>

      <div className="panel">
        <h3><Icon name="terminal" size={18} /> Lab commands (authorized lab targets only)</h3>
        <CodeBlock lines={lesson.labCommands} />
      </div>

      <div className="panel">
        <h3><Icon name="check" size={18} /> Knowledge check</h3>
        <ul>{lesson.check.map((c, i) => <li key={i}>{c}</li>)}</ul>
      </div>
    </section>
  );
}
