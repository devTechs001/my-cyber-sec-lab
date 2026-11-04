import { useEffect, useState } from "react";
import { api } from "../api.js";
import SectionHeading from "../components/SectionHeading.jsx";

export default function Resources() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.resources().then(setData).catch((e) => setError(e.message));
  }, []);

  if (error) return <section className="section"><p className="error">API error: {error}</p></section>;
  if (!data) return <section className="section"><p>Loading…</p></section>;

  return (
    <section className="section">
      <SectionHeading
        eyebrow="Real links"
        title="Resources — OSes, vulnerable targets, platforms & certs"
        subtitle="Official sources only. Download vulnerable systems ONLY into your isolated lab; use remote platforms for legal practice."
      />
      {data.resources.map((cat) => (
        <div className="panel" key={cat.category}>
          <h3>{cat.category}</h3>
          <div className="resource-list">
            {cat.items.map((r) => (
              <a className="resource-item" key={r.name} href={r.url} target="_blank" rel="noreferrer">
                <span className="resource-name">🔗 {r.name}</span>
                <span className="resource-desc">{r.desc}</span>
              </a>
            ))}
          </div>
        </div>
      ))}
      <div className="ethics-banner">
        <h3>⚖️ Remember</h3>
        <p>Downloads like Metasploitable/DVWA are intentionally vulnerable — keep them on a host-only network. For remote practice use TryHackMe, HackTheBox, PortSwigger Academy. Never test systems you don't own.</p>
      </div>
    </section>
  );
}
