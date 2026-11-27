# Deployment Guide — Netlify (frontend) + Render (backend)

> The Netlify config lives at the **repo root** (`netlify.toml`) — Netlify does not
> read config files from subdirectories like `deploy/`. It includes the SPA fallback,
> the `/api/*` proxy to Render, and security headers (CSP, X-Frame-Options, …).

## Architecture

```
Browser ──▶ Netlify (React/Vite static build, SPA)
   │  /api/*  ──proxied──▶ Render (Express API, Node)
   └─▶ (dev: Vite proxy → localhost:5000)
```

## 1. Local development

```bash
# Terminal 1 — API
cd server && npm install && npm run dev        # http://localhost:5000

# Terminal 2 — frontend
cd client && npm install && npm run dev        # http://localhost:5173 (proxies /api → :5000)
```

## 2. Deploy the API to Render

1. Push this repo to GitHub (`git push`).
2. Render dashboard → **New → Blueprint** → connect the repo → Render reads `deploy/render.yaml` (sets `NODE_ENV=production`).
   - Or manual: **New → Web Service** → Root Directory `server`, Build `npm install`, Start `npm start`; set `NODE_ENV=production` in the service environment.
3. Add env var `CLIENT_URL` = your Netlify URL (after step 3).
4. Health check: `https://<service>.onrender.com/api/health` should return `{"status":"ok"}`.

## 3. Deploy the frontend to Netlify

1. Netlify → **Add new site → Import an existing project** → pick the repository root.
2. Use the committed root `netlify.toml` as the source of truth. It keeps Netlify's base directory at the repository root, runs `cd client && npm ci && npm run build`, and publishes `client/dist`.
3. If existing Netlify UI settings override the file, clear the Base directory (leave it blank/root), set the build command to `cd client && npm ci && npm run build`, and set Publish directory to `client/dist`. Do not combine a `client` base directory with the `client/dist` publish path.
4. The `/api/*` redirect in the root `netlify.toml` proxies to Render. Replace `https://cyber-ec-lab-api.onrender.com` there if your Render service has a different hostname. No `VITE_API_URL` setting is needed with this same-origin proxy.
5. Trigger a fresh deploy. In the deploy log, confirm Node 22, the Vite build completes, and Netlify publishes `client/dist`. Then verify the site URL and `/api/health`.

## 4. Verify

- Open the Netlify URL → hero shows `API status: ok`.
- The simulated Kali terminal and its warm-up lab are development-only; production builds/API do not expose them.
- `/lessons`, `/labs`, `/tools`, `/networking`, `/roadmap` all load data from the Render API.
- `curl https://<render>.onrender.com/api/tools | head` returns JSON.
