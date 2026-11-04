import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { api } from "../api.js";
import SectionHeading from "../components/SectionHeading.jsx";
import Icon from "../components/Icon.jsx";

const quickLinks = [
  { to: "/terminal", icon: "terminal", title: "Lab Terminal", desc: "Simulated Kali shell — practice nmap & msfconsole in-browser" },
  { to: "/lab-setup", icon: "server", title: "Virtual Lab", desc: "Build a real isolated lab: Kali + Metasploitable + DVWA" },
  { to: "/labs", icon: "flask", title: "Hands-on Labs", desc: "8 dedicated attack scenarios with steps & deliverables" },
  { to: "/lessons", icon: "book", title: "Lessons", desc: "12 modules from networking to reporting" },
  { to: "/tools", icon: "tools", title: "Tools", desc: "Nmap, Burp, Wireshark, Metasploit & more" },
  { to: "/resources", icon: "link", title: "Resources", desc: "Official downloads, platforms, certs & bug bounty" },
  { to: "/networking", icon: "globe", title: "Networking", desc: "OSI, ports, subnetting, hardening checklist" },
  { to: "/roadmap", icon: "map", title: "Roadmap", desc: "24-week plan to job-ready" },
];

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const load = useCallback(() => {
    api.dashboard().then(setData).catch((e) => setError(e.message));
  }, []);

  useEffect(() => { load(); }, [load]);

  const toggle = async (id, done) => {
    try {
      await api.setProgress(id, !done);
      load();
    } catch { /* offline — ignore */ }
  };

  if (error) return <section className="section"><p className="error">API error: {error} — start the server first.</p></section>;
  if (!data) return <section className="section"><p>Loading dashboard…</p></section>;

  const { stats, lessonProgress, labProgress, nextLesson, nextLab, activity } = data;

  return (
    <section className="section">
      <SectionHeading
        eyebrow="Command center"
        title="Dashboard"
        subtitle="Your whole lab at a glance — progress, next steps and one-click access to every feature."
      />

      {/* STAT CARDS */}
      <div className="stat-grid">
        <div className="stat-card">
          <span className="stat-num">{stats.lessonsDone}<small>/{stats.lessons}</small></span>
          <span className="stat-label">Lessons done</span>
          <div className="progress-bar"><div className="progress-fill" style={{ width: `${stats.lessonPercent}%` }} /></div>
          <span className="stat-pct">{stats.lessonPercent}%</span>
        </div>
        <div className="stat-card">
          <span className="stat-num">{stats.labsDone}<small>/{stats.labs}</small></span>
          <span className="stat-label">Labs completed</span>
          <div className="progress-bar"><div className="progress-fill cyan" style={{ width: `${stats.labPercent}%` }} /></div>
          <span className="stat-pct">{stats.labPercent}%</span>
        </div>
        <div className="stat-card">
          <span className="stat-num">{stats.tools}</span>
          <span className="stat-label">Tools covered</span>
          <Link to="/tools" className="stat-link">browse →</Link>
        </div>
        <div className="stat-card">
          <span className="stat-num">{stats.resourceLinks}</span>
          <span className="stat-label">Resource links</span>
          <Link to="/resources" className="stat-link">open →</Link>
        </div>
      </div>

      {/* NEXT UP */}
      <div className="detail-grid">
        <div className="panel next-up">
          <h3>⏭️ Next lesson</h3>
          {nextLesson ? (
            <>
              <p><strong>{nextLesson.icon} {nextLesson.title}</strong> <span className="badge badge-amber">{nextLesson.level}</span></p>
              <Link to={`/lessons/${nextLesson.id}`} className="btn btn-primary">Continue →</Link>
            </>
          ) : <p>🎉 All lessons complete!</p>}
        </div>
        <div className="panel next-up">
          <h3>🧪 Next lab</h3>
          {nextLab ? (
            <>
              <p><strong>{nextLab.title}</strong> <span className="badge badge-cyan">{nextLab.difficulty}</span></p>
              <Link to={`/labs/${nextLab.id}`} className="btn btn-primary">Start lab →</Link>
            </>
          ) : <p>🎉 All labs complete!</p>}
        </div>
      </div>

      {/* QUICK LAUNCH */}
      <SectionHeading eyebrow="Launch" title="Everything, one click away" />
      <div className="card-grid">
        {quickLinks.map((q) => (
          <Link to={q.to} className="card card-link" key={q.to}>
            <div className="card-icon">{q.icon}</div>
            <h3>{q.title}</h3>
            <p>{q.desc}</p>
          </Link>
        ))}
      </div>

      {/* PROGRESS CHECKLISTS */}
      <div className="detail-grid">
        <div className="panel">
          <h3>🎓 Lesson progress</h3>
          <ul className="checklist">
            {lessonProgress.map((l) => (
              <li key={l.id} className={l.done ? "done" : ""}>
                <button className="check-btn" onClick={() => toggle(l.id, l.done)} aria-label="toggle">
                  {l.done ? "✅" : "⬜"}
                </button>
                <Link to={`/lessons/${l.id}`}>{l.order}. {l.icon} {l.title}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="panel">
          <h3>🧪 Lab progress</h3>
          <ul className="checklist">
            {labProgress.map((l) => (
              <li key={l.id} className={l.done ? "done" : ""}>
                <button className="check-btn" onClick={() => toggle(l.id, l.done)} aria-label="toggle">
                  {l.done ? "✅" : "⬜"}
                </button>
                <Link to={`/labs/${l.id}`}>{l.title}</Link>
              </li>
            ))}
          </ul>
          <h3>🕒 Recent activity</h3>
          {activity.length === 0 && <p className="muted">No activity yet — mark something complete!</p>}
          <ul className="activity">
            {activity.map((a, i) => (
              <li key={i}>
                {a.done ? "✅" : "↩️"} <code>{a.id}</code> — {a.at ? new Date(a.at).toLocaleString() : ""}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
