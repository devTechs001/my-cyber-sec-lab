import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api.js";
import SectionHeading from "../components/SectionHeading.jsx";

const highlights = [
  { icon: "🎓", title: "11 Lessons", text: "From networking fundamentals to responsible disclosure — structured learning path." },
  { icon: "🧪", title: "7 Hands-on Labs", text: "Dedicated practice environments: DVWA, Metasploitable, Wireshark pcaps, privesc VMs." },
  { icon: "🧰", title: "12 Tools", text: "Nmap, Burp Suite, Wireshark, Metasploit, Hydra, SQLmap and more — with safe-use rules." },
  { icon: "🌐", title: "Networking Docs", text: "OSI model, ports, subnetting, key protocol flows and a hardening checklist." },
  { icon: "🗺️", title: "24-Week Roadmap", text: "Phase-by-phase plan from beginner to job-ready security professional." },
  { icon: "⚖️", title: "Ethics First", text: "Every lab is scoped to systems you own or are authorized to test." },
];

const featuredTools = ["Nmap", "Burp Suite", "Wireshark", "Metasploit"];

export default function Home() {
  const [health, setHealth] = useState(null);

  useEffect(() => {
    api.health().then(setHealth).catch(() => setHealth({ status: "offline" }));
  }, []);

  return (
    <div>
      {/* HERO */}
      <section className="hero">
        <div className="hero-grid-bg" aria-hidden="true" />
        <div className="hero-inner">
          <span className="eyebrow">Ethical hacking · learned safely · in your own lab</span>
          <h1>
            Master <span className="grad">Cyber Security</span>
            <br />
            the hands-on way.
          </h1>
          <p className="hero-sub">
            A MERN + Python learning lab with step-by-step lessons, dedicated virtual labs for
            Nmap, Burp Suite, Wireshark and Metasploit, networking docs and a 24-week roadmap —
            everything you need for a job-ready security portfolio.
          </p>
          <div className="hero-cta">
            <Link to="/lessons" className="btn btn-primary">Start Lesson 1 →</Link>
            <Link to="/labs" className="btn btn-ghost">Jump into a Lab</Link>
          </div>
          <div className="hero-status">
            <span className={`dot ${health?.status === "ok" ? "dot-ok" : "dot-warn"}`} />
            API status: {health ? health.status : "connecting…"} {health?.time && `· ${health.time}`}
          </div>
        </div>
      </section>

      {/* HIGHLIGHTS */}
      <section className="section">
        <SectionHeading
          eyebrow="What's inside"
          title="A complete learning lab, not just a blog"
          subtitle="Lessons, labs, tools and docs wired together through a real MERN stack."
        />
        <div className="card-grid">
          {highlights.map((h) => (
            <div className="card" key={h.title}>
              <div className="card-icon">{h.icon}</div>
              <h3>{h.title}</h3>
              <p>{h.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED TOOLS */}
      <section className="section">
        <SectionHeading
          eyebrow="Toolbox"
          title="Industry tools you'll actually use"
          subtitle="Each tool entry includes install steps, an example and its rules of engagement."
        />
        <div className="tool-chips">
          {featuredTools.map((t) => (
            <span className="tool-chip" key={t}>{t}</span>
          ))}
          <span className="tool-chip">+ Hydra · SQLmap · Gobuster · Netcat · John · ZAP …</span>
        </div>
        <div style={{ marginTop: "1.25rem" }}>
          <Link to="/tools" className="btn btn-ghost">Browse all tools →</Link>
        </div>
      </section>

      {/* ETHICS BANNER */}
      <section className="section">
        <div className="ethics-banner">
          <h3>⚖️ Rules of engagement</h3>
          <p>
            Everything here runs against <strong>your own virtual lab</strong> or authorized platforms
            (DVWA, Metasploitable, TryHackMe, HackTheBox). Unauthorized access to computer systems is a
            crime — the skills on this site exist to defend, with permission.
          </p>
        </div>
      </section>
    </div>
  );
}
