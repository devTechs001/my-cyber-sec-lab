import { NavLink, Link } from "react-router-dom";

const links = [
  { to: "/", label: "Home" },
  { to: "/lessons", label: "Lessons" },
  { to: "/labs", label: "Labs" },
  { to: "/tools", label: "Tools" },
  { to: "/networking", label: "Networking" },
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
