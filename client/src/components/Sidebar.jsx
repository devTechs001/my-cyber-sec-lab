import { useEffect, useState } from "react";
import { NavLink, Link } from "react-router-dom";
import Icon from "./Icon.jsx";
import { api, tokenStore } from "../api.js";

const groups = [
  {
    title: "Overview",
    links: [
      { to: "/dashboard", label: "Dashboard", icon: "dashboard" },
      { to: "/projects", label: "Projects", icon: "rocket" },
      { to: "/field-notes", label: "Field Notes", icon: "book" },
    ],
  },
  {
    title: "Learn",
    links: [
      { to: "/lessons", label: "Lessons", icon: "book" },
      { to: "/labs", label: "Labs", icon: "flask" },
      { to: "/soc-analyst", label: "SOC Analyst Path", icon: "eye" },
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
      { to: "/cheatsheets", label: "Cheat-sheets", icon: "bolt" },
      { to: "/networking", label: "Networking", icon: "globe" },
      { to: "/resources", label: "Resources", icon: "link" },
      { to: "/reference", label: "Attacks & Defense", icon: "target" },
      { to: "/roadmap", label: "Roadmap", icon: "map" },
    ],
  },
];

export default function Sidebar({ open, onNavigate }) {
  const [stats, setStats] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    api.dashboard().then((d) => { setStats(d.stats); setUser(d.user); }).catch(() => {});
    api.me().then((u) => setUser(u.username)).catch(() => {});
  }, []);

  const signOut = async () => {
    try { await api.logout(); } catch { /* ignore */ }
    tokenStore.set(null);
    setUser(null);
    window.location.href = "/";
  };

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
          <div className="sidebar-user">
            {user ? (
              <>
                <span className="user-chip"><span className="user-avatar">{user[0].toUpperCase()}</span> {user}</span>
                <button className="link-btn" onClick={signOut}>sign out</button>
              </>
            ) : (
              <Link to="/login" className="btn btn-ghost side-login" onClick={onNavigate}>
                <Icon name="shield" size={15} /> Sign in / Register
              </Link>
            )}
          </div>
          <div className="sidebar-ethics">
            <Icon name="shield" size={14} /> Authorized lab targets only
          </div>
        </div>
      </aside>
    </>
  );
}
