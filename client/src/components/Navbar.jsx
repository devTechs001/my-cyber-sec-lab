import { NavLink, Link } from "react-router-dom";
import Icon from "./Icon.jsx";
import ThemeToggle from "./ThemeToggle.jsx";

const links = [
  { to: "/dashboard", label: "Dashboard", icon: "dashboard" },
  { to: "/lessons", label: "Lessons", icon: "book" },
  { to: "/labs", label: "Labs", icon: "flask" },
  { to: "/terminal", label: "Terminal", icon: "terminal" },
  { to: "/lab-setup", label: "Lab Setup", icon: "server" },
  { to: "/tools", label: "Tools", icon: "tools" },
  { to: "/networking", label: "Networking", icon: "globe" },
  { to: "/resources", label: "Resources", icon: "link" },
  { to: "/roadmap", label: "Roadmap", icon: "map" },
];

export default function Navbar() {
  return (
    <header className="navbar">
      <Link to="/" className="brand">
        <span className="brand-glyph"><Icon name="shield" size={22} /></span>
        <span>Cyber<b>EC</b>Lab</span>
      </Link>
      <nav className="nav-links">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
          >
            <Icon name={l.icon} size={15} />
            <span>{l.label}</span>
          </NavLink>
        ))}
      </nav>
      <ThemeToggle />
    </header>
  );
}
