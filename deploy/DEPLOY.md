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
2. Render dashboard → **New → Blueprint** → connect the repo → Render reads `deploy/render.yaml`.
   - Or manual: **New → Web Service** → Root Directory `server`, Build `npm install`, Start `npm start`.
3. Add env var `CLIENT_URL` = your Netlify URL (after step 3).
4. Health check: `https://<service>.onrender.com/api/health` should return `{"status":"ok"}`.

## 3. Deploy the frontend to Netlify

1. Netlify → **Add new site → Import an existing project** → pick the repo.
2. Build settings: Base directory `client`, Build command `npm run build`, Publish directory `client/dist`
   (or leave blank — `deploy/netlify.toml` at repo root is picked up automatically if base is set).
3. Set environment variable `VITE_API_URL` if you prefer direct calls, or rely on the `/api/*`
   redirect in `netlify.toml` (update the target URL to your Render service).
4. Redeploy → your site is live at `https://<name>.netlify.app`.

## 4. Verify

- Open the Netlify URL → hero shows `API status: ok`.
- `/lessons`, `/labs`, `/tools`, `/networking`, `/roadmap` all load data from the Render API.
- `curl https://<render>.onrender.com/api/tools | head` returns JSON.
