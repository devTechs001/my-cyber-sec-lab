import { useEffect, useState } from "react";
import { api } from "../api.js";
import SectionHeading from "../components/SectionHeading.jsx";
import Icon from "../components/Icon.jsx";

export default function Networking() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.networking().then(setData).catch((e) => setError(e.message));
  }, []);

  if (error) return <section className="section"><p className="error">API error: {error}</p></section>;
  if (!data) return <section className="section"><p>Loading…</p></section>;

  return (
    <section className="section">
      <SectionHeading
        eyebrow="Reference"
        title="Networking Docs"
        subtitle="The networking knowledge every security engineer needs — mirrored from docs/networking.md."
      />

      <div className="panel">
        <h3><Icon name="globe" size={18} /> OSI model & where security lives</h3>
        <table className="table">
          <thead><tr><th>Layer</th><th>Name</th><th>Examples</th><th>Security controls</th></tr></thead>
          <tbody>
            {data.osiModel.map((o) => (
              <tr key={o.layer}>
                <td>L{o.layer}</td><td>{o.name}</td><td>{o.examples}</td><td>{o.security}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="detail-grid">
        <div className="panel">
          <h3><Icon name="network" size={18} /> Common ports</h3>
          <table className="table">
            <thead><tr><th>Port</th><th>Service</th><th>Proto</th></tr></thead>
            <tbody>
              {data.commonPorts.map((p) => (
                <tr key={p.port}><td>{p.port}</td><td>{p.service}</td><td>{p.proto}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="panel">
          <h3><Icon name="chart" size={18} /> Subnetting cheat-sheet</h3>
          <p>{data.subnetting.formula}</p>
          <p>{data.subnetting.cheat}</p>
          <p><em>Example: {data.subnetting.example}</em></p>
          <h3><Icon name="refresh" size={18} /> Key protocol flows</h3>
          <ul>{data.keyFlows.map((f, i) => <li key={i}>{f}</li>)}</ul>
        </div>
      </div>

      <div className="panel">
        <h3><Icon name="shield" size={18} /> Hardening checklist</h3>
        <ul>{data.hardeningChecklist.map((h, i) => <li key={i}>{h}</li>)}</ul>
      </div>
    </section>
  );
}
