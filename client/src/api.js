// All API calls use relative /api URLs — the dev server (Vite) proxies them to
// Express, and in production the same origin serves both client and API.
const BASE = "/api";
const TOKEN_KEY = "ceclab-token";

export const tokenStore = {
  get: () => { try { return localStorage.getItem(TOKEN_KEY); } catch { return null; } },
  set: (t) => { try { t ? localStorage.setItem(TOKEN_KEY, t) : localStorage.removeItem(TOKEN_KEY); } catch { /* private mode */ } },
};

async function request(path, options = {}) {
  const headers = { ...(options.headers || {}) };
  const token = tokenStore.get();
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${BASE}${path}`, { ...options, headers });
  if (res.status === 401 && path !== "/auth/me") {
    // token invalid/expired — drop it
    tokenStore.set(null);
  }
  if (!res.ok) {
    let msg = `API error ${res.status}`;
    try { msg = (await res.json()).error || msg; } catch { /* ignore */ }
    throw new Error(msg);
  }
  return res.json();
}

const get = (path) => request(path);
const post = (path, body) =>
  request(path, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });

export const api = {
  health: () => get("/health"),
  lessons: () => get("/lessons"),
  lesson: (id) => get(`/lessons/${id}`),
  labs: () => get("/labs"),
  lab: (id) => get(`/labs/${id}`),
  tools: () => get("/tools"),
  tool: (name) => get(`/tools/${name}`),
  socPlaybook: () => get("/soc-playbook"),
  networking: () => get("/networking"),
  roadmap: () => get("/roadmap"),
  labSetup: () => get("/labsetup"),
  vulnSystems: () => get("/vulnsystems"),
  cheatsheets: () => get("/cheatsheets"),
  projects: (role = "All") => get(`/projects?role=${encodeURIComponent(role)}`),
  project: (id) => get(`/projects/${id}`),
  resources: () => get("/resources"),
  reference: (category) => get(category ? `/reference?category=${encodeURIComponent(category)}` : "/reference"),
  search: (q) => get(`/search?q=${encodeURIComponent(q)}`),
  search: (q) => get(`/search?q=${encodeURIComponent(q)}`),
  dashboard: () => get("/dashboard"),
  progress: () => get("/progress"),
  setProgress: (id, done) => post(`/progress/${id}`, { done }),
  register: (username, password) => post("/auth/register", { username, password }),
  login: (username, password) => post("/auth/login", { username, password }),
  logout: () => post("/auth/logout", {}),
  me: () => get("/auth/me"),
};
