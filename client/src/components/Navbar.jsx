import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Icon from "./Icon.jsx";
import ThemeToggle from "./ThemeToggle.jsx";
import { api } from "../api.js";

const typeIcon = { lesson: "book", lab: "flask", tool: "tools", project: "rocket", cheatsheet: "bolt", reference: "target" };

// Slim top bar: brand, search, mobile menu button, theme toggle.
export default function Navbar({ onMenu }) {
  const [q, setQ] = useState("");
  const [results, setResults] = useState(null);
  const [open, setOpen] = useState(false);
  const boxRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (q.trim().length < 2) { setResults(null); return; }
    const t = setTimeout(() => {
      api.search(q).then((d) => { setResults(d.results); setOpen(true); }).catch(() => {});
    }, 180);
    return () => clearTimeout(t);
  }, [q]);

  useEffect(() => {
    const close = (e) => { if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const go = (url) => { setOpen(false); setQ(""); setResults(null); navigate(url); };

  return (
    <header className="navbar">
      <div className="navbar-left">
        <button className="menu-btn" onClick={onMenu} aria-label="Toggle navigation menu">
          <span className="menu-bars"><i /><i /><i /></span>
        </button>
        <Link to="/" className="brand">
          <span className="brand-glyph"><Icon name="shield" size={22} /></span>
          <span>Cyber<b>EC</b>Lab</span>
        </Link>
      </div>
      <div className="nav-search" ref={boxRef}>
        <Icon name="target" size={15} className="nav-search-icon" />
        <input
          className="nav-search-input"
          placeholder="Search lessons, labs, tools, attacks… ( / )"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onFocus={() => results && setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && results?.length) go(results[0].url);
            if (e.key === "/" && document.activeElement !== e.target) { e.preventDefault(); e.target.focus(); }
          }}
          aria-label="Search the lab"
        />
        {open && results && (
          <div className="nav-search-drop">
            {results.length === 0 && <div className="nav-search-empty">No matches for “{q}”</div>}
            {results.map((r) => (
              <button key={r.type + r.id} className="nav-search-item" onClick={() => go(r.url)}>
                <Icon name={typeIcon[r.type] || "shield"} size={15} />
                <span className="nav-search-title">{r.title}</span>
                <span className="badge badge-cyan">{r.type}</span>
              </button>
            ))}
          </div>
        )}
      </div>
      <ThemeToggle />
    </header>
  );
}
