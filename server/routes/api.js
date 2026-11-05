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

router.get("/labs", (_req, res) => res.json({ count: labs.length, labs }));
router.get("/labs/:id", (req, res) => {
  const lab = labs.find((l) => l.id === req.params.id);
  if (!lab) return res.status(404).json({ error: "lab not found" });
  res.json(lab);
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
