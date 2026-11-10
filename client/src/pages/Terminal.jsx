import { useEffect, useRef, useState } from "react";
import { runCommand, createSession, promptFor } from "../terminal/engine.js";
import SectionHeading from "../components/SectionHeading.jsx";

const BOOT = [
  { text: "Cyber EC Lab — simulated Kali Linux terminal", cls: "out" },
  { text: "SIMULATION ONLY: no real commands execute. Practice syntax against the fake lab network 192.168.56.0/24.", cls: "warn" },
  { text: "Targets: 192.168.56.101 (Metasploitable2) · 192.168.56.102 (DVWA) · type 'help' to begin.", cls: "out" },
  { text: "", cls: "out" },
];

export default function Terminal() {
  const [session, setSession] = useState(() => createSession());
  const [lines, setLines] = useState(BOOT);
  const [input, setInput] = useState("");
  const [histIdx, setHistIdx] = useState(-1);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [lines]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const submit = (e) => {
    e.preventDefault();
    const raw = input;
    setInput("");
    setHistIdx(-1);
    setSession((s) => {
      const res = runCommand(s, raw);
      setLines((prev) => {
        const next = [...prev, { text: promptFor(s) + raw, cls: "cmd" }, ...res.lines];
        return res.clear ? [] : next;
      });
      return res.session;
    });
  };

  const onKeyDown = (e) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      const h = session.history;
      if (!h.length) return;
      const idx = histIdx === -1 ? h.length - 1 : Math.max(0, histIdx - 1);
      setHistIdx(idx);
      setInput(h[idx]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const h = session.history;
      if (histIdx === -1) return;
      const idx = histIdx + 1;
      if (idx >= h.length) { setHistIdx(-1); setInput(""); } else { setHistIdx(idx); setInput(h[idx]); }
    } else if (e.key === "l" && e.ctrlKey) {
      e.preventDefault();
      setLines([]);
    }
  };

  return (
    <section className="section">
      <SectionHeading
        eyebrow="Interactive practice"
        title="Lab Terminal (simulated Kali)"
        subtitle="Type 'help' — try nmap -sV 192.168.56.101, msfconsole, ping, cat /lab/README.txt. ↑/↓ recalls history, Ctrl+L clears."
      />
      <div className="terminal" onClick={() => inputRef.current?.focus()}>
        <div className="terminal-bar">
          <span className="t-dot red" /><span className="t-dot yellow" /><span className="t-dot green" />
          <span className="terminal-title">labuser@kali — lab terminal (simulated)</span>
        </div>
        <div className="terminal-body" ref={scrollRef}>
          {lines.map((l, i) => (
            <div key={i} className={`t-line t-${l.cls}`}>{l.text}</div>
          ))}
          <form onSubmit={submit} className="t-input-row">
            <span className="t-prompt">{promptFor(session)}</span>
            <input
              ref={inputRef}
              className="t-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              autoComplete="off"
              autoCapitalize="off"
              spellCheck="false"
              aria-label="terminal input"
            />
          </form>
        </div>
      </div>
      <p className="terminal-hint">
        Real practice: build the same lab on VMs — see <a href="/lab-setup">Lab Setup</a> and <a href="/resources">Resources</a>.
      </p>
    </section>
  );
}
