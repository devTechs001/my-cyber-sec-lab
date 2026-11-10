import { useEffect, useState } from "react";
import { api } from "../api.js";
import SectionHeading from "../components/SectionHeading.jsx";
import CodeBlock from "../components/CodeBlock.jsx";
import Icon from "../components/Icon.jsx";

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
      <div className="panel portfolio-workflow">
        <h3>Portfolio exercise · local Juice Shop assessment</h3>
        <p>Document a small, reproducible assessment of an intentionally vulnerable app on your own machine. Keep the target bound to loopback; this is a lab demonstration, not permission to test a public system.</p>
        <ol>
          <li><strong>Define scope:</strong> record purpose, local URL <code>http://127.0.0.1:3000</code>, test window, exclusions, and a no-destructive-testing rule.</li>
          <li><strong>Start the isolated target:</strong> <code>docker run --rm -d --name juice-shop -p 127.0.0.1:3000:3000 bkimminich/juice-shop</code>. Confirm it answers with <code>curl -I http://127.0.0.1:3000</code>.</li>
          <li><strong>Baseline safely:</strong> run <code>zap-baseline.py -t http://127.0.0.1:3000 -r zap-baseline.html</code>; review passive alerts and manually validate only in-scope behavior.</li>
          <li><strong>Record one finding:</strong> capture sanitized request/response, impact, affected route, reproduction steps, and a screenshot with secrets/personal data removed.</li>
          <li><strong>Recommend, fix, retest:</strong> propose a specific control, apply it only in your lab copy, rerun the check, and record before/after evidence.</li>
          <li><strong>Close the lab:</strong> stop the container with <code>docker stop juice-shop</code>; publish only sanitized evidence and clearly label the target as intentionally vulnerable.</li>
        </ol>
        <p className="safety-text"><strong>CV/folio deliverables:</strong> one-page executive summary, scope and methodology, finding card (severity + rationale), redacted evidence, remediation, retest result, and tool/version list. Never claim a lab result was a real client engagement.</p>
      </div>
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
              <span className="card-icon"><Icon name={t.icon} size={26} /></span>
              <span className="badge badge-cyan">{t.category}</span>
            </div>
            <h3>{t.name}</h3>
            <p>{t.description}</p>
            <CodeBlock title="Install" lines={[t.install]} />
            <CodeBlock title="Real commands (lab / authorized only)" lines={t.commands || [t.example]} />
            {t.procedure?.length > 0 && (
              <details className="tool-procedure">
                <summary>Practical procedure &amp; portfolio evidence</summary>
                <ol>{t.procedure.map((step, i) => <li key={i}>{step}</li>)}</ol>
              </details>
            )}
            <p className="safety-text"><Icon name="shield" size={16} /> {t.safety}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
