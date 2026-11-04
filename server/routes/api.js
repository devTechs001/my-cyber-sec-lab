import { Router } from "express";
import { lessons } from "../data/lessons.js";
import { labs } from "../data/labs.js";
import { tools } from "../data/tools.js";
import { networking } from "../data/networking.js";
import { labSetup } from "../data/labsetup.js";
import { resources } from "../data/resources.js";

const router = Router();

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

// Simple in-memory progress tracker (per session) — demo of MERN interactivity.
const progress = new Map();
router.get("/progress", (_req, res) => res.json({ progress: [...progress.entries()].map(([k, v]) => ({ id: k, ...v })) }));
router.post("/progress/:id", (req, res) => {
  const done = !!req.body?.done;
  progress.set(req.params.id, { done, at: new Date().toISOString() });
  res.json({ id: req.params.id, done });
});

export default router;
