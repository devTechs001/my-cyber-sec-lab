import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api.js";
import SectionHeading from "../components/SectionHeading.jsx";

const diffClass = (d) =>
  d === "Beginner" ? "badge badge-green" : d === "Intermediate" ? "badge badge-amber" : "badge badge-red";

export default function Labs() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.labs().then(setData).catch((e) => setError(e.message));
  }, []);

  return (
    <section className="section">
      <SectionHeading
        eyebrow="Hands-on practice"
        title="Dedicated Labs"
        subtitle="Each lab is a self-contained scenario with tools, target, step-by-step instructions and a safety note."
      />
      {error && <p className="error">API error: {error} — start the server first.</p>}
      <div className="lab-list">
        {data?.labs.map((lab) => (
          <Link to={`/labs/${lab.id}`} className="lab-card" key={lab.id}>
            <div className="lab-card-head">
              <h3>{lab.title}</h3>
              <span className={diffClass(lab.difficulty)}>{lab.difficulty}</span>
            </div>
            <p>{lab.objective}</p>
            <div className="lab-tools">
              {lab.tools.map((t) => <span className="tool-chip small" key={t}>{t}</span>)}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
