import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api.js";
import SectionHeading from "../components/SectionHeading.jsx";
import Icon from "../components/Icon.jsx";

const highlights = [
  { icon: "book", title: "17 Lessons", text: "Networking → web deep dive → SIEM/blue team → AD attacks → cloud → incident response." },
  { icon: "flask", title: "13 Hands-on Labs", text: "Terminal warm-up, DVWA, Metasploitable, SIEM detection, AD chain, phishing triage, WiFi and more." },
  { icon: "terminal", title: "Live Web Terminal", text: "Practice Linux + nmap + Metasploit syntax right in your browser — safe simulation." },
  { icon: "server", title: "Virtual Lab Guide", text: "Kali attack box + vulnerable VMs (Metasploitable, DVWA) on an isolated host-only network." },
  { icon: "link", title: "Real Resources", text: "Official links: Kali, VulnHub, TryHackMe, HackTheBox, PortSwigger Academy, certs." },
  { icon: "tools", title: "42 Security Tools", text: "Real commands plus practical, evidence-led procedures for code, cloud, TLS, web and endpoint assessments." },
  { icon: "target", title: "Attacks & Defense", text: "Troubleshooting, WiFi, recon, XSS/SQLi/MITM/DirB — with detection & mitigations." },
  { icon: "globe", title: "Networking Docs", text: "OSI model, ports, subnetting, key protocol flows and a hardening checklist." },
  { icon: "map", title: "24-Week Roadmap", text: "Phase-by-phase plan from beginner to job-ready security professional." },
  { icon: "shield", title: "Ethics First", text: "Every lab is scoped to systems you own or are authorized to test." },
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
          <div className="hero-cta fade-up d3">
            <Link to="/dashboard" className="btn btn-primary"><Icon name="dashboard" size={16} /> Open Dashboard</Link>
            <Link to="/lessons" className="btn btn-ghost"><Icon name="book" size={16} /> Start Lesson 1 →</Link>
            <Link to="/terminal" className="btn btn-ghost"><Icon name="terminal" size={16} /> Lab Terminal</Link>
            <Link to="/lab-setup" className="btn btn-ghost"><Icon name="server" size={16} /> Virtual Lab</Link>
          </div>
          <div className="hero-status fade-up d4">
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
              <div className="card-icon"><Icon name={h.icon} size={26} /></div>
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
          <h3><Icon name="shield" size={20} /> Rules of engagement</h3>
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
