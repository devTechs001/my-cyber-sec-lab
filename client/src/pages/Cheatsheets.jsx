import { useEffect, useState } from "react";
import { api } from "../api.js";
import SectionHeading from "../components/SectionHeading.jsx";
import CodeBlock from "../components/CodeBlock.jsx";

export default function Cheatsheets() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.cheatsheets().then(setData).catch((e) => setError(e.message));
  }, []);

  if (error) return <section className="section"><p className="error">API error: {error}</p></section>;
  if (!data) return <section className="section"><p>Loading…</p></section>;

  return (
    <section className="section">
      <SectionHeading
        eyebrow="Quick reference"
        title="Cheat-sheets"
        subtitle="Step-by-step command references for the core tools — lab/authorized targets only."
      />
      <div className="cheatsheet-grid">
        {data.cheatsheets.map((c, i) => (
          <div className="panel pop" style={{ animationDelay: `${i * 60}ms` }} key={c.id}>
            <h3>{c.icon} {c.title}</h3>
            {c.sections.map((s) => (
              <div key={s.title}>
                <h4 className="cheat-sub">{s.title}</h4>
                <CodeBlock lines={s.commands} />
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
