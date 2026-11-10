import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../api.js";
import Icon from "../components/Icon.jsx";

export default function LabDetail() {
  const { id } = useParams();
  const [lab, setLab] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.lab(id).then(setLab).catch((e) => setError(e.message));
  }, [id]);

  if (error) return <section className="section"><p className="error">Lab not found. <Link to="/labs">Back to labs</Link></p></section>;
  if (!lab) return <section className="section"><p>Loading…</p></section>;

  return (
    <section className="section">
      <Link to="/labs" className="back-link">← All labs</Link>
      <div className="detail-header">
        <div>
          <span className="eyebrow">{lab.difficulty}</span>
          <h2>{lab.title}</h2>
          <p className="section-sub">{lab.objective}</p>
          {lab.mitre && <p className="mitre-tag"><Icon name="target" size={14} /> MITRE ATT&CK: <code>{lab.mitre}</code></p>}
        </div>
      </div>

      <div className="detail-grid">
        <div className="panel">
          <h3><Icon name="target" size={18} /> Target</h3>
          <p>{lab.target}</p>
          <h3><Icon name="tools" size={18} /> Tools</h3>
          <div className="lab-tools">
            {lab.tools.map((t) => <span className="tool-chip small" key={t}>{t}</span>)}
          </div>
        </div>
        <div className="panel">
          <h3><Icon name="file" size={18} /> Deliverable</h3>
          <p>{lab.deliverable}</p>
          <h3><Icon name="shield" size={18} /> Safety</h3>
          <p className="safety-text">{lab.safety}</p>
        </div>
      </div>

      <div className="panel">
        <h3><Icon name="list" size={18} /> Steps</h3>
        <ol className="steps">{lab.steps.map((s, i) => <li key={i}>{s}</li>)}</ol>
      </div>
    </section>
  );
}
