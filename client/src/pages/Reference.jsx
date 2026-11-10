import { useEffect, useState } from "react";
import { api } from "../api.js";
import SectionHeading from "../components/SectionHeading.jsx";
import CodeBlock from "../components/CodeBlock.jsx";
import Icon from "../components/Icon.jsx";

export default function Reference() {
  const [data, setData] = useState(null);
  const [cat, setCat] = useState(null); // null = all
  const [error, setError] = useState(null);

  useEffect(() => {
    api.reference(cat).then(setData).catch((e) => setError(e.message));
  }, [cat]);

  if (error) return <section className="section"><p className="error">API error: {error}</p></section>;

  return (
    <section className="section">
      <SectionHeading
        eyebrow="Reference point"
        title="Attacks & Defense Reference"
        subtitle={data?.intro || "Network troubleshooting, WiFi, recon, web attacks and protections — with real commands, detection and mitigations."}
      />

      <div className="filter-bar">
        <button className={cat === null ? "filter-btn active" : "filter-btn"} onClick={() => setCat(null)}><Icon name="book" size={15} /> All</button>
        {data?.categories.map((c) => (
          <button
            key={c.id}
            className={cat === c.id ? "filter-btn active" : "filter-btn"}
            onClick={() => setCat(c.id)}
          >
            <Icon name={c.icon} size={16} /> {c.title} ({c.items})
          </button>
        ))}
      </div>

      {!data && <p>Loading…</p>}
      {data?.sections.map((s, si) => (
        <div className="panel pop" style={{ animationDelay: `${si * 60}ms` }} key={s.id}>
          <h3><Icon name={s.icon} size={19} /> {s.title}</h3>
          <div className="ref-grid">
            {s.items.map((item, i) => (
              <div className="ref-card" key={i}>
                <h4>{item.title}</h4>
                <p>{item.what}</p>
                {item.commands && <CodeBlock title="Commands (lab / authorized only)" lines={item.commands} />}
                {item.detect && <p className="ref-line"><b><Icon name="eye" size={14} /> Detect:</b> {item.detect}</p>}
                {item.protect && <p className="ref-line"><b><Icon name="shield" size={14} /> Protect:</b> {item.protect}</p>}
                {item.fix && <p className="ref-line"><b><Icon name="tools" size={14} /> Fix:</b> {item.fix}</p>}
                {item.mitre && <p className="ref-line mitre"><Icon name="target" size={14} /> MITRE ATT&CK: {item.mitre}</p>}
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
