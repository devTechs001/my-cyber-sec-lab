import { Link } from "react-router-dom";
import Icon from "./Icon.jsx";
import ThemeToggle from "./ThemeToggle.jsx";

// Slim top bar: brand, mobile menu button, theme toggle.
export default function Navbar({ onMenu }) {
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
      <ThemeToggle />
    </header>
  );
}
