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

const router = Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROGRESS_FILE = path.join(__dirname, "..", "data", "progress.json");

// File-backed progress so completions survive server restarts (gitignored).
function loadProgress() {
  try {
    return new Map(Object.entries(JSON.parse(fs.readFileSync(PROGRESS_FILE, "utf8"))));
  } catch {
    return new Map();
  }
}
function saveProgress(map) {
  try {
    fs.writeFileSync(PROGRESS_FILE, JSON.stringify(Object.fromEntries(map), null, 2));
  } catch { /* read-only fs on some hosts — keep in-memory */ }
}
const progress = loadProgress();

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

router.get("/resources", (_req, res) =>
  res.json({ categories: resources.map((r) => r.category), resources })
);

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

router.get("/progress", (_req, res) =>
  res.json({ progress: [...progress.entries()].map(([k, v]) => ({ id: k, ...v })) })
);
router.post("/progress/:id", (req, res) => {
  const done = !!req.body?.done;
  progress.set(req.params.id, { done, at: new Date().toISOString() });
  saveProgress(progress);
  res.json({ id: req.params.id, done });
});

// ---- Aggregate dashboard ----
router.get("/dashboard", (_req, res) => {
  const lessonProgress = lessons.map((l) => ({
    id: l.id, order: l.order, title: l.title, icon: l.icon, level: l.level,
    done: !!progress.get(l.id)?.done, at: progress.get(l.id)?.at || null,
  }));
  const labProgress = labs.map((l) => ({
    id: l.id, title: l.title, difficulty: l.difficulty,
    done: !!progress.get(l.id)?.done, at: progress.get(l.id)?.at || null,
  }));
  const doneLessons = lessonProgress.filter((l) => l.done).length;
  const doneLabs = labProgress.filter((l) => l.done).length;
  const nextLesson = lessonProgress.find((l) => !l.done) || null;
  const nextLab = labProgress.find((l) => !l.done) || null;
  const activity = [...progress.entries()]
    .map(([id, v]) => ({ id, done: v.done, at: v.at }))
    .sort((a, b) => (b.at || "").localeCompare(a.at || ""))
    .slice(0, 8);
  res.json({
    stats: {
      lessons: lessons.length, lessonsDone: doneLessons,
      labs: labs.length, labsDone: doneLabs,
      tools: tools.length, resourceLinks: resources.reduce((n, c) => n + c.items.length, 0),
      lessonPercent: Math.round((doneLessons / lessons.length) * 100),
      labPercent: Math.round((doneLabs / labs.length) * 100),
    },
    lessonProgress, labProgress, nextLesson, nextLab, activity,
  });
});

export default router;
