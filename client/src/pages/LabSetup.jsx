import { useEffect, useState } from "react";
import { api } from "../api.js";
import SectionHeading from "../components/SectionHeading.jsx";
import Icon from "../components/Icon.jsx";

export default function LabSetup() {
  const [data, setData] = useState(null);
  const [vulns, setVulns] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.labSetup().then(setData).catch((e) => setError(e.message));
    api.vulnSystems().then(setVulns).catch((e) => setError(e.message));
  }, []);

  if (error) return <section className="section"><p className="error">API error: {error}</p></section>;
  if (!data) return <section className="section"><p>Loading…</p></section>;

  return (
    <section className="section">
      <SectionHeading
        eyebrow="Real hardware lab"
        title="Build Your Virtual Attack Lab"
        subtitle={data.intro}
      />

      <div className="detail-grid">
        <div className="panel">
          <h3><Icon name="cpu" size={18} /> Requirements</h3>
          <p><strong>Hardware:</strong> {data.requirements.hardware}</p>
          <p><strong>Software:</strong></p>
          <ul>{data.requirements.software.map((s, i) => <li key={i}>{s}</li>)}</ul>
        </div>
        <div className="panel">
          <h3><Icon name="network" size={18} /> Lab topology (isolated)</h3>
          <pre className="topology">{data.topology.join("\n")}</pre>
        </div>
      </div>

      <div className="panel">
        <h3><Icon name="list" size={18} /> Setup steps</h3>
        <ol className="steps">
          {data.steps.map((s) => (
            <li key={s.n}>
              <strong>Step {s.n} — {s.title}.</strong> {s.detail}{" "}
              {s.link && <a href={s.link.url} target="_blank" rel="noreferrer"><Icon name="link" size={14} /> {s.link.label}</a>}
              {s.links && (
                <span>
                  {s.links.map((l) => (
                    <span key={l.url}> <a href={l.url} target="_blank" rel="noreferrer"><Icon name="link" size={14} /> {l.label}</a></span>
                  ))}
                </span>
              )}
            </li>
          ))}
        </ol>
      </div>

      {vulns && (
        <div className="panel">
          <h3><Icon name="target" size={18} /> Vulnerable systems catalog — download into your ISOLATED lab only</h3>
          <div className="vuln-grid">
            {vulns.systems.map((v, i) => (
              <div className="vuln-card pop" style={{ animationDelay: `${i * 50}ms` }} key={v.name}>
                <div className="vuln-head">
                  <h4>{v.name}</h4>
                  <span className="badge badge-amber">{v.difficulty}</span>
                </div>
                <p className="vuln-type">{v.type}</p>
                <p>{v.highlights}</p>
                <p className="vuln-creds"><Icon name="key" size={14} /> default creds: <code>{v.creds}</code></p>
                <ol className="vuln-steps">{v.steps.map((s, j) => <li key={j}>{s}</li>)}</ol>
                <a href={v.url} target="_blank" rel="noreferrer" className="vuln-link"><Icon name="download" size={14} /> download</a>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="ethics-banner">
        <h3><Icon name="shield" size={18} /> {data.safety.split(".")[0]}.</h3>
        <p>{data.safety}</p>
      </div>
    </section>
  );
}
