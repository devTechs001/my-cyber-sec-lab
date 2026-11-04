// All API calls use relative /api URLs — the dev server (Vite) proxies them to
// Express, and in production the same origin serves both client and API.
const BASE = "/api";

async function get(path) {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) throw new Error(`API error ${res.status} on ${path}`);
  return res.json();
}

async function post(path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`API error ${res.status} on ${path}`);
  return res.json();
}

export const api = {
  health: () => get("/health"),
  lessons: () => get("/lessons"),
  lesson: (id) => get(`/lessons/${id}`),
  labs: () => get("/labs"),
  lab: (id) => get(`/labs/${id}`),
  tools: () => get("/tools"),
  tool: (name) => get(`/tools/${name}`),
  networking: () => get("/networking"),
  roadmap: () => get("/roadmap"),
  progress: () => get("/progress"),
  setProgress: (id, done) => post(`/progress/${id}`, { done }),
};
