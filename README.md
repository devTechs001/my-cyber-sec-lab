# ⌁ Cyber EC Lab — Ethical Hacking Learning Portfolio

A full-stack (**MERN + Python**) learning lab for ethical hacking and cyber security:
step-by-step **lessons**, dedicated hands-on **labs** (Nmap, Burp Suite, Wireshark, Metasploit…),
a **tools** reference, **networking docs**, processes and a 24-week **roadmap** — packaged as a
job-ready portfolio site deployable to **Netlify** (frontend) and **Render** (API).

> ⚖️ **Ethics first:** every lesson and lab targets only systems you own or are explicitly
> authorized to test (your own VMs, DVWA, Metasploitable, TryHackMe, HackTheBox).
> Unauthorized access to computer systems is illegal.

## 🗂️ Project structure

```
my-cyber-sec-lab/
├── client/                 # React (Vite) frontend — modern dark UI
│   └── src/pages/          # Home, Lessons, Labs, Tools, Networking, Roadmap
├── server/                 # Express API (Node) — lessons/labs/tools/networking/progress
│   └── data/               # lesson, lab, tool and networking content (JSON modules)
├── python/labs/            # Educational Python scripts (stdlib only)
│   ├── port_scanner.py     #   lab-only TCP port scanner
│   ├── hash_lab.py         #   hashing/salt/PBKDF2 demo (own hashes only)
│   └── log_analyzer.py     #   failed-login analyzer + sample log
├── docs/
│   ├── networking.md       # OSI, ports, subnetting, protocol flows, hardening
│   ├── processes.md        # pentest methodology + rules of engagement
│   └── report-template.md  # professional pentest report template
└── deploy/
    ├── netlify.toml        # frontend deploy config (SPA + /api proxy)
    ├── render.yaml         # backend deploy blueprint
    └── DEPLOY.md           # step-by-step deployment guide
```

## 🚀 Quick start (local)

```bash
# 1. API server (Express) — http://localhost:5000
cd server && npm install && npm run dev

# 2. Frontend (React/Vite) — http://localhost:5173  (auto-proxies /api → :5000)
cd client && npm install && npm run dev
```

Open http://localhost:5173 — the hero shows live `API status: ok` from the backend.

## 🧪 Python labs

```bash
cd python/labs
python3 port_scanner.py 127.0.0.1 --ports 22,80,443   # YOUR machine only
python3 hash_lab.py                                    # hashing & salting demo
python3 log_analyzer.py auth.log.sample                # failed-login report
```

## 🌐 Deploy

| Part | Platform | Config | Steps |
|---|---|---|---|
| Frontend | **Netlify** | `deploy/netlify.toml` | Import repo → base `client`, build `npm run build`, publish `dist` |
| Backend API | **Render** | `deploy/render.yaml` | New Web Service → root `server`, start `npm start`; health: `/api/health` |

Full walkthrough: [`deploy/DEPLOY.md`](deploy/DEPLOY.md)

## 📚 What you'll learn (see the site's Lessons & Roadmap pages)

1. Networking fundamentals · 2. Linux for security · 3. Recon & OSINT · 4. Nmap scanning ·
5. Web pentesting with Burp Suite · 6. Metasploit basics · 7. Wireshark packet analysis ·
8. Password security · 9. Wireless & social engineering awareness · 10. Privilege escalation ·
11. Reporting & responsible disclosure

## 🧰 Tools covered

Nmap · Burp Suite · Wireshark · Metasploit · Hydra · John the Ripper · hashcat · Gobuster ·
SQLmap · Netcat · Aircrack-ng · OWASP ZAP · LinPEAS/WinPEAS

## 🔌 API endpoints

| Endpoint | Description |
|---|---|
| `GET /api/health` | service status |
| `GET /api/lessons` · `/api/lessons/:id` | learning path |
| `GET /api/labs` · `/api/labs/:id` | hands-on labs |
| `GET /api/tools` · `/api/tools/:name` | tool reference |
| `GET /api/networking` | networking docs |
| `GET /api/roadmap` | 24-week plan |
| `GET/POST /api/progress/:id` | mark lessons complete |

## 🤝 Contributing

1. `git checkout -b feature/your-lab`
2. Add your lesson/lab in `server/data/` (or a page in `client/src/pages/`)
3. `git commit -m "add: <what>"` && `git push`
4. Open a Pull Request — describe the lab, target and safety notes.
