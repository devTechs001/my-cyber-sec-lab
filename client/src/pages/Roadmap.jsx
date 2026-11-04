import { useEffect, useState } from "react";
import { api } from "../api.js";
import SectionHeading from "../components/SectionHeading.jsx";

export default function Roadmap() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.roadmap().then(setData).catch((e) => setError(e.message));
  }, []);

  return (
    <section className="section">
      <SectionHeading
        eyebrow="Processes & plan"
        title="24-Week Roadmap to Job-Ready"
        subtitle="Four phases — foundations, offense, exploitation, professional. Pair this with docs/processes.md."
      />
      {error && <p className="error">API error: {error}</p>}
      <div className="roadmap">
        {data?.phases.map((p) => (
          <div className="roadmap-phase" key={p.phase}>
            <div className="roadmap-num">Phase {p.phase}</div>
            <h3>{p.title}</h3>
            <span className="badge badge-cyan">Weeks {p.weeks}</span>
            <ul>{p.items.map((it, i) => <li key={i}>{it}</li>)}</ul>
          </div>
        ))}
      </div>
      <div className="ethics-banner">
        <h3>📋 The process that ties it together</h3>
        <p>
          Every engagement follows the same loop: <strong>Scope → Recon → Scan → Exploit → Escalate →
          Report → Remediate</strong>. See <code>docs/processes.md</code> for the full methodology and
          <code>docs/report-template.md</code> for writing findings professionally.
        </p>
      </div>
    </section>
  );
}
