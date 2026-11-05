import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api.js";
import SectionHeading from "../components/SectionHeading.jsx";

const levelClass = (lvl) =>
  lvl === "Beginner" ? "badge badge-green" : lvl === "Intermediate" ? "badge badge-amber" : "badge badge-red";

export default function Lessons() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.lessons().then(setData).catch((e) => setError(e.message));
  }, []);

  return (
    <section className="section">
      <SectionHeading
        eyebrow="Learning path"
        title="Lessons"
        subtitle="11 modules in order — each with objectives, a walkthrough, lab-only commands and a knowledge check."
      />
      {error && <p className="error">API error: {error} — start the server (`npm run dev` in server/).</p>}
      <div className="card-grid">
        {data?.lessons.map((l) => (
          <Link to={`/lessons/${l.id}`} className="card card-link" key={l.id}>
            <div className="card-top">
              <span className="card-icon">{l.icon}</span>
              <span className={levelClass(l.level)}>{l.level}</span>
            </div>
            <h3>
              {l.order}. {l.title}
            </h3>
            <p>{l.summary}</p>
            <span className="card-meta">⏱ {l.duration}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
