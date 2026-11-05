import { useEffect, useState } from "react";
import { api } from "../api.js";
import SectionHeading from "../components/SectionHeading.jsx";
import Icon from "../components/Icon.jsx";

const roleBadge = (role) =>
  role === "Blue Team" ? "badge badge-cyan" : "badge badge-red";

export default function Projects() {
  const [data, setData] = useState(null);
  const [role, setRole] = useState("All");
  const [error, setError] = useState(null);

  useEffect(() => {
    api.projects(role).then(setData).catch((e) => setError(e.message));
  }, [role]);

  if (error) return <section className="section"><p className="error">API error: {error}</p></section>;

  return (
    <section className="section">
      <SectionHeading
        eyebrow="Job-ready portfolio"
        title="Projects — Blue Team & Red Team"
        subtitle="7 complete project blueprints. Build each in your isolated lab, host it on GitHub with a professional README, and showcase it here."
      />

      <div className="filter-bar">
        {(data?.roles || ["All", "Blue Team", "Red Team"]).map((r) => (
          <button
            key={r}
            className={role === r ? "filter-btn active" : "filter-btn"}
            onClick={() => setRole(r)}
          >
            {r === "Blue Team" ? "🛡️" : r === "Red Team" ? "⚔️" : "📁"} {r}
          </button>
        ))}
      </div>

      {!data && <p>Loading…</p>}
      <div className="project-grid">
        {data?.projects.map((p, i) => (
          <article className="project-card pop" style={{ animationDelay: `${i * 60}ms` }} key={p.id}>
            <div className="project-head">
              <span className="card-icon"><Icon name={p.role === "Blue Team" ? "shield" : "target"} size={24} /></span>
              <div>
                <h3>{p.icon} {p.title}</h3>
                <div className="project-meta">
                  <span className={roleBadge(p.role)}>{p.role}</span>
                  <span className="badge">{p.level}</span>
                  <span className="badge">⏱ {p.duration}</span>
                </div>
              </div>
            </div>
            <p className="project-summary">{p.summary}</p>
            {p.example && <p className="project-example">💡 Real example: {p.example}</p>}

            <h4 className="cheat-sub">Lab steps</h4>
            <ol className="steps project-steps">{p.labSteps.map((s, j) => <li key={j}>{s}</li>)}</ol>

            <h4 className="cheat-sub">Tools</h4>
            <div className="lab-tools">{p.tools.map((t) => <span className="tool-chip small" key={t}>{t}</span>)}</div>

            <h4 className="cheat-sub">What to showcase</h4>
            <ul className="showcase-list">
              {p.showcase.map((s, j) => <li key={j}><Icon name="chart" size={14} /> {s}</li>)}
            </ul>
          </article>
        ))}
      </div>

      {data?.showcaseGuide && (
        <div className="panel showcase-guide pop">
          <h3>🎯 {data.showcaseGuide.title}</h3>
          <div className="detail-grid">
            {data.showcaseGuide.points.map((pt) => (
              <div key={pt.title}>
                <h4 className="cheat-sub">{pt.title}</h4>
                <p>{pt.detail}</p>
              </div>
            ))}
          </div>
          <h4 className="cheat-sub">README template for every repo</h4>
          <pre className="readme-template">{data.showcaseGuide.readmeTemplate.join("\n")}</pre>
        </div>
      )}
    </section>
  );
}
