import { useEffect, useState } from "react";
import { NavLink, Link } from "react-router-dom";
import Icon from "./Icon.jsx";
import { api } from "../api.js";

const groups = [
  {
    title: "Overview",
    links: [{ to: "/dashboard", label: "Dashboard", icon: "dashboard" }],
  },
  {
    title: "Learn",
    links: [
      { to: "/lessons", label: "Lessons", icon: "book" },
      { to: "/labs", label: "Labs", icon: "flask" },
    ],
  },
  {
    title: "Practice",
    links: [
      { to: "/terminal", label: "Terminal", icon: "terminal" },
      { to: "/lab-setup", label: "Virtual Lab", icon: "server" },
    ],
  },
  {
    title: "Reference",
    links: [
      { to: "/tools", label: "Tools", icon: "tools" },
      { to: "/networking", label: "Networking", icon: "globe" },
      { to: "/resources", label: "Resources", icon: "link" },
      { to: "/roadmap", label: "Roadmap", icon: "map" },
    ],
  },
];

export default function Sidebar({ open, onNavigate }) {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.dashboard().then((d) => setStats(d.stats)).catch(() => {});
  }, []);

  return (
    <>
      <div
        className={open ? "sidebar-overlay show" : "sidebar-overlay"}
        onClick={onNavigate}
        aria-hidden="true"
      />
      <aside className={open ? "sidebar open" : "sidebar"}>
        <nav className="sidebar-nav">
          {groups.map((g) => (
            <div className="sidebar-group" key={g.title}>
              <div className="sidebar-group-title">{g.title}</div>
              {g.links.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  onClick={onNavigate}
                  className={({ isActive }) => (isActive ? "side-link active" : "side-link")}
                >
                  <Icon name={l.icon} size={17} />
                  <span>{l.label}</span>
                </NavLink>
              ))}
            </div>
          ))}
        </nav>
        <div className="sidebar-foot">
          <Link to="/dashboard" className="side-progress" onClick={onNavigate}>
            <div className="side-progress-head">
              <Icon name="chart" size={15} />
              <span>Lesson progress</span>
              <b>{stats ? `${stats.lessonPercent}%` : "…"}</b>
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: stats ? `${stats.lessonPercent}%` : "0%" }}
              />
            </div>
            {stats && (
              <small>
                {stats.lessonsDone}/{stats.lessons} lessons · {stats.labsDone}/{stats.labs} labs
              </small>
            )}
          </Link>
          <div className="sidebar-ethics">
            <Icon name="shield" size={14} /> Authorized lab targets only
          </div>
        </div>
      </aside>
    </>
  );
}
