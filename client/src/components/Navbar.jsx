import { NavLink, Link } from "react-router-dom";

const links = [
  { to: "/dashboard", label: "📊 Dashboard" },
  { to: "/lessons", label: "Lessons" },
  { to: "/labs", label: "Labs" },
  { to: "/terminal", label: "🖥️ Terminal" },
  { to: "/lab-setup", label: "Lab Setup" },
  { to: "/tools", label: "Tools" },
  { to: "/networking", label: "Networking" },
  { to: "/resources", label: "Resources" },
  { to: "/roadmap", label: "Roadmap" },
];

export default function Navbar() {
  return (
    <header className="navbar">
      <Link to="/" className="brand">
        <span className="brand-glyph">⌁</span>
        <span>Cyber<b>EC</b>Lab</span>
      </Link>
      <nav className="nav-links">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.to === "/"}
            className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
          >
            {l.label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}
