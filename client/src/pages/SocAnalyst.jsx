import { useEffect, useState } from "react";
import { api } from "../api.js";
import CodeBlock from "../components/CodeBlock.jsx";
import Icon from "../components/Icon.jsx";
import SectionHeading from "../components/SectionHeading.jsx";

export default function SocAnalyst() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.socPlaybook().then(setData).catch((e) => setError(e.message));
  }, []);

  if (error) return <section className="section"><p className="error">SOC playbook unavailable: {error}</p></section>;
  if (!data) return <section className="section"><p>Loading SOC analyst path…</p></section>;

  return (
    <section className="section soc-page">
      <SectionHeading eyebrow="Blue Team · Incident lifecycle" title={data.title} subtitle={data.intro} />

      <div className="ethics-banner soc-safety"><Icon name="shield" size={19} /><p>{data.safety}</p></div>

      <div className="panel soc-lab">
        <div className="soc-section-title"><Icon name="server" size={21} /><div><h3>{data.lab.title}</h3><p>Keep these components on a private, host-only network. Start with snapshots and synthetic or sanitized evidence.</p></div></div>
        <div className="soc-components">{data.lab.components.map((item, i) => <div className="soc-component" key={item}><span className="soc-index">{String(i + 1).padStart(2, "0")}</span><span>{item}</span></div>)}</div>
        <CodeBlock title="First commands · analyst workstation" lines={data.lab.firstCommands} />
      </div>

      <div className="soc-roadmap-head"><div><span className="eyebrow">Operational workflow</span><h3>From alert to closure</h3></div><span className="badge badge-cyan">{data.phases.length} phases</span></div>
      <div className="soc-phases">
        {data.phases.map((phase) => (
          <article className="panel soc-phase" key={phase.id}>
            <div className="soc-phase-head"><span className="soc-phase-mark"><Icon name={phase.id === "report" ? "file" : phase.id === "containment" ? "shield" : phase.id === "recover" ? "refresh" : "eye"} size={20} /></span><div><h3>{phase.title}</h3><p>{phase.goal}</p></div></div>
            <div className="soc-tools"><strong>Tools</strong>{phase.tools.map((tool) => <span className="tool-chip small" key={tool}>{tool}</span>)}</div>
            <h4 className="soc-subhead">Procedure</h4>
            <ol className="soc-steps">{phase.steps.map((step, i) => <li key={i}>{step}</li>)}</ol>
            <CodeBlock title="Commands / queries" lines={phase.commands} />
            <div className="soc-evidence"><h4><Icon name="file" size={16} /> Record as evidence</h4><ul>{phase.evidence.map((item) => <li key={item}>{item}</li>)}</ul></div>
          </article>
        ))}
      </div>

      <div className="panel soc-exercise">
        <span className="eyebrow">Hands-on tabletop</span>
        <h3>{data.exercise.title}</h3>
        <p className="soc-scenario">{data.exercise.scenario}</p>
        <h4 className="soc-subhead">Work the case</h4>
        <ol className="soc-steps">{data.exercise.steps.map((step, i) => <li key={i}>{step}</li>)}</ol>
        <CodeBlock title="Example Splunk pivots · adapt fields to your dataset" lines={data.exercise.spl} />
        <div className="soc-evidence"><h4><Icon name="check" size={16} /> Case deliverables</h4><ul>{data.exercise.deliverables.map((item) => <li key={item}>{item}</li>)}</ul></div>
      </div>
    </section>
  );
}
