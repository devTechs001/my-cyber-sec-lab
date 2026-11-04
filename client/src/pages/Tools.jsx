import { useEffect, useState } from "react";
import { api } from "../api.js";
import SectionHeading from "../components/SectionHeading.jsx";
import CodeBlock from "../components/CodeBlock.jsx";

export default function Tools() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    api.tools().then(setData).catch((e) => setError(e.message));
  }, []);

  const categories = data ? ["All", ...data.categories] : ["All"];
  const visible = data?.tools.filter((t) => filter === "All" || t.category === filter) ?? [];

  return (
    <section className="section">
      <SectionHeading
        eyebrow="Toolbox"
        title="Tools of the trade"
        subtitle="Install steps, a safe example and the rules of engagement for each tool."
      />
      {error && <p className="error">API error: {error}</p>}
      <div className="filter-bar">
        {categories.map((c) => (
          <button
            key={c}
            className={filter === c ? "filter-btn active" : "filter-btn"}
            onClick={() => setFilter(c)}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="card-grid">
        {visible.map((t) => (
          <div className="card tool-card" key={t.name}>
            <div className="card-top">
              <span className="card-icon">{t.icon}</span>
              <span className="badge badge-cyan">{t.category}</span>
            </div>
            <h3>{t.name}</h3>
            <p>{t.description}</p>
            <CodeBlock title="Install" lines={[t.install]} />
            <CodeBlock title="Example (lab only)" lines={[t.example]} />
            <p className="safety-text">⚖️ {t.safety}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
