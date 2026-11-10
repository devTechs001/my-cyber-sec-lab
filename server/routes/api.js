import { Router } from "express";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { lessons } from "../data/lessons.js";
import { labs } from "../data/labs.js";
import { tools } from "../data/tools.js";
import { networking } from "../data/networking.js";
import { labSetup } from "../data/labsetup.js";
import { resources } from "../data/resources.js";
import { vulnSystems } from "../data/vulnsystems.js";
import { cheatsheets } from "../data/cheatsheets.js";
import { projects, showcaseGuide } from "../data/projects.js";
import { reference } from "../data/reference.js";
import { register, login, logout, authMiddleware } from "../auth.js";

const router = Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROGRESS_FILE = path.join(__dirname, "..", "data", "progress.json");

// ---- per-user (or guest) progress, persisted to disk ----
function loadProgress() {
  try {
    const raw = JSON.parse(fs.readFileSync(PROGRESS_FILE, "utf8"));
    // migrate legacy flat format { id: {done, at} } under "guest"
    const first = Object.values(raw)[0];
    if (first && typeof first === "object" && "done" in first) return { guest: raw };
    return raw;
  } catch {
    return { guest: {} };
  }
}
function saveProgress() {
  try { fs.writeFileSync(PROGRESS_FILE, JSON.stringify(progress, null, 2)); } catch { /* read-only */ }
}
const progress = loadProgress();
const bucketFor = (req) => (req.user ? req.user.username : "guest");

router.use(authMiddleware);

// ---- auth ----
router.post("/auth/register", (req, res) => {
  const r = register(req.body?.username, req.body?.password);
  if (r.error) return res.status(400).json({ error: r.error });
  res.json(r);
});
router.post("/auth/login", (req, res) => {
  const r = login(req.body?.username, req.body?.password);
  if (r.error) return res.status(401).json({ error: r.error });
  res.json(r);
});
router.post("/auth/logout", (req, res) => { logout(req.token); res.json({ ok: true }); });
router.get("/auth/me", (req, res) => {
  if (!req.user) return res.status(401).json({ error: "not signed in" });
  res.json({ username: req.user.username });
});

// ---- content ----
router.get("/lessons", (_req, res) => res.json({ count: lessons.length, lessons }));
router.get("/lessons/:id", (req, res) => {
  const lesson = lessons.find((l) => l.id === req.params.id);
  if (!lesson) return res.status(404).json({ error: "lesson not found" });
  res.json(lesson);
});


// ---- MITRE ATT&CK mapping for labs ----
const LAB_MITRE = {
  "lab-01-network-discovery": "T1046 Network Service Discovery",
  "lab-02-web-burp-dvwa": "T1190 Exploit Public-Facing Application",
  "lab-03-metasploitable": "T1210 Exploitation of Remote Services",
  "lab-04-wireshark-pcap": "T1040 Network Sniffing (analysis)",
  "lab-05-password-lab": "T1110 Brute Force",
  "lab-06-privesc": "T1068 Exploitation for Privilege Escalation",
  "lab-07-ctf-style": "Full kill chain",
  "lab-08-terminal-warmup": "T1059 Command & Scripting Interpreter",
  "lab-09-siem-detection": "TA0043 Detection (blue team)",
  "lab-10-ad-attack-chain": "T1558 Kerberoasting / T1550 Pass-the-Hash",
  "lab-11-phishing-triage": "T1566 Phishing (triage)",
  "lab-12-vuln-management": "T1190 scanning (defense)",
  "lab-13-wifi-lab": "T1110 / T1557 wireless",
};

// ---- global search across all content ----
const SEARCH_INDEX = [
  ...lessons.map((l) => ({ type: "lesson", id: l.id, title: `${l.order}. ${l.title}`, text: l.summary + " " + l.objectives.join(" "), url: `/lessons/${l.id}` })),
  ...labs.map((l) => ({ type: "lab", id: l.id, title: l.title, text: l.objective + " " + l.tools.join(" "), url: `/labs/${l.id}` })),
  ...tools.map((t) => ({ type: "tool", id: t.name, title: t.name, text: t.category + " " + t.description, url: "/tools" })),
  ...projects.map((p) => ({ type: "project", id: p.id, title: p.title, text: p.role + " " + p.summary, url: "/projects" })),
  ...cheatsheets.map((c) => ({ type: "cheatsheet", id: c.id, title: c.title, text: c.sections.map((s) => s.commands.join(" ")).join(" "), url: "/cheatsheets" })),
  ...reference.categories.flatMap((c) =>
    c.items.map((i) => ({ type: "reference", id: `${c.id}/${i.title}`, title: `${c.icon} ${i.title}`, text: i.what + " " + (i.commands || []).join(" "), url: "/reference" }))
  ),
];
router.get("/search", (req, res) => {
  const q = String(req.query.q || "").toLowerCase().trim();
  if (q.length < 2) return res.json({ q, count: 0, results: [] });
  const results = SEARCH_INDEX
    .filter((r) => (r.title + " " + r.text).toLowerCase().includes(q))
    .slice(0, 12)
    .map(({ type, id, title, url }) => ({ type, id, title, url }));
  res.json({ q, count: results.length, results });
});

router.get("/labs", (_req, res) =>
  res.json({ count: labs.length, labs: labs.map((l) => ({ ...l, mitre: LAB_MITRE[l.id] || null })) })
);
router.get("/labs/:id", (req, res) => {
  const lab = labs.find((l) => l.id === req.params.id);
  if (!lab) return res.status(404).json({ error: "lab not found" });
  res.json({ ...lab, mitre: LAB_MITRE[lab.id] || null });
});

router.get("/tools", (_req, res) => {
  const categories = [...new Set(tools.map((t) => t.category))];
  res.json({ count: tools.length, categories, tools });
});
router.get("/tools/:name", (req, res) => {
  const tool = tools.find((t) => t.name.toLowerCase() === req.params.name.toLowerCase());
  if (!tool) return res.status(404).json({ error: "tool not found" });
  res.json(tool);
});

router.get("/networking", (_req, res) => res.json(networking));
router.get("/labsetup", (_req, res) => res.json(labSetup));
router.get("/vulnsystems", (_req, res) => res.json({ count: vulnSystems.length, systems: vulnSystems }));
router.get("/cheatsheets", (_req, res) => res.json({ count: cheatsheets.length, cheatsheets }));

router.get("/projects", (req, res) => {
  const role = req.query.role;
  const list = role && role !== "All" ? projects.filter((p) => p.role === role) : projects;
  res.json({ count: list.length, total: projects.length, roles: ["All", "Blue Team", "Red Team"], projects: list, showcaseGuide });
});
router.get("/projects/:id", (req, res) => {
  const p = projects.find((x) => x.id === req.params.id);
  if (!p) return res.status(404).json({ error: "project not found" });
  res.json({ ...p, showcaseGuide });
});

router.get("/resources", (_req, res) =>
  res.json({ categories: resources.map((r) => r.category), resources })
);

router.get("/reference", (req, res) => {
  const cat = req.query.category;
  const cats = reference.categories.map((c) => ({ id: c.id, title: c.title, icon: c.icon, items: c.items.length }));
  const list = cat ? reference.categories.filter((c) => c.id === cat) : reference.categories;
  res.json({ intro: reference.intro, categories: cats, sections: list });
});

router.get("/roadmap", (_req, res) => {
  res.json({
    phases: [
      { phase: 1, title: "Foundations", weeks: "1-4", items: ["Networking fundamentals", "Linux CLI", "Python for security", "Basic security concepts (CIA triad)"] },
      { phase: 2, title: "Core Offense", weeks: "5-10", items: ["Recon & OSINT", "Nmap scanning", "Web pentesting with Burp", "Wireshark analysis"] },
      { phase: 3, title: "Exploitation", weeks: "11-16", items: ["Metasploit basics", "Password attacks", "Privilege escalation", "CTF platforms (TryHackMe/HTB)"] },
      { phase: 4, title: "Professional", weeks: "17-24", items: ["Full pentest reports", "Bug bounty / responsible disclosure", "Defensive skills (SIEM, hardening)", "Job-ready portfolio + certifications (eJPT, Security+, OSCP path)"] },
    ],
  });
});

// ---- progress (per account; guests share the "guest" bucket) ----
router.get("/progress", (req, res) => {
  const bucket = progress[bucketFor(req)] || {};
  res.json({ user: req.user?.username || null, progress: Object.entries(bucket).map(([id, v]) => ({ id, ...v })) });
});
router.post("/progress/:id", (req, res) => {
  const key = bucketFor(req);
  if (!progress[key]) progress[key] = {};
  const done = !!req.body?.done;
  progress[key][req.params.id] = { done, at: new Date().toISOString() };
  saveProgress();
  res.json({ id: req.params.id, done, user: req.user?.username || "guest" });
});

// ---- aggregate dashboard ----
router.get("/dashboard", (req, res) => {
  const bucket = progress[bucketFor(req)] || {};
  const lessonProgress = lessons.map((l) => ({
    id: l.id, order: l.order, title: l.title, icon: l.icon, level: l.level,
    done: !!bucket[l.id]?.done, at: bucket[l.id]?.at || null,
  }));
  const labProgress = labs.map((l) => ({
    id: l.id, title: l.title, difficulty: l.difficulty,
    done: !!bucket[l.id]?.done, at: bucket[l.id]?.at || null,
  }));
  const doneLessons = lessonProgress.filter((l) => l.done).length;
  const doneLabs = labProgress.filter((l) => l.done).length;
  res.json({
    user: req.user?.username || null,
    stats: {
      lessons: lessons.length, lessonsDone: doneLessons,
      labs: labs.length, labsDone: doneLabs,
      tools: tools.length, resourceLinks: resources.reduce((n, c) => n + c.items.length, 0),
      lessonPercent: Math.round((doneLessons / lessons.length) * 100),
      labPercent: Math.round((doneLabs / labs.length) * 100),
    },
    lessonProgress, labProgress,
    nextLesson: lessonProgress.find((l) => !l.done) || null,
    nextLab: labProgress.find((l) => !l.done) || null,
    activity: Object.entries(bucket)
      .map(([id, v]) => ({ id, done: v.done, at: v.at }))
      .sort((a, b) => (b.at || "").localeCompare(a.at || ""))
      .slice(0, 8),
  });
});

export default router;
