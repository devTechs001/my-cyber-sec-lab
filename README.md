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
│   ├── src/pages/          # Home, Lessons, Labs, Terminal, LabSetup, Tools, Resources, Networking, Roadmap
│   └── src/terminal/       # simulated Kali shell engine (in-browser, zero-risk practice)
├── server/                 # Express API (Node) — lessons/labs/tools/networking/roadmap/resources/labsetup/progress
│   └── data/               # content as JSON modules
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

## 📊 Dashboard (`/dashboard`)
Command center for the whole lab: stat cards (lesson/lab progress with % bars),
"next up" lesson & lab, a one-click launch grid (Terminal, Virtual Lab, Labs, Lessons,
Tools, Resources, Networking, Roadmap), interactive checklists that persist server-side
(`server/data/progress.json`, gitignored), and a recent-activity feed.

## 🖥️ In-browser terminal (`/terminal`)
Practice safely in a **simulated Kali shell** — nothing real executes:
```
help → ls /lab → cat README.txt → ping 192.168.56.101 → nmap -sV 192.168.56.101
→ msfconsole → search vsftpd → use exploit/unix/ftp/vsftpd_234_backdoor
→ set RHOSTS 192.168.56.101 → exploit
```

## 🚀 Portfolio projects (`/projects`)
7 job-ready blueprints with lab steps, tools and "what to showcase" checklists,
filterable by role — **Blue Team/SOC**: SIEM lab (Splunk/Wazuh), phishing triage,
SOAR-lite Python automation, Sigma detection engineering · **Red Team**: AD attack
chain, web exploitation walkthrough (DVWA/Juice Shop), vulnerability management
cycle (OpenVAS→DefectDojo). Includes the GitHub-README template + LinkedIn showcase guide.

## 🏗️ Real virtual lab (`/lab-setup` + `/resources`)
Step-by-step guide to build an isolated lab: VirtualBox host-only network
`192.168.56.0/24`, **Kali Linux** attack box, **Metasploitable2/DVWA** vulnerable
targets, snapshots, strict isolation rules. `/resources` lists 25 official links
(Kali, VulnHub, TryHackMe, HackTheBox, PortSwigger Academy, certs, bug bounty).

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
| `GET /api/labsetup` · `/api/vulnsystems` | virtual-lab guide + vulnerable-systems catalog |
| `GET /api/cheatsheets` | command cheat-sheets |
| `GET /api/resources` | 50 official learning links (10 categories) |
| `GET /api/projects?role=…` · `/api/projects/:id` | 7 portfolio project blueprints + showcase guide |
| `GET /api/dashboard` | aggregate stats, per-user progress, next-up, activity |
| `POST /api/auth/register\|login\|logout` · `GET /api/auth/me` | user accounts (scrypt + bearer token) |
| `GET/POST /api/progress/:id` | mark lessons/labs complete (per account, persisted) |

## 🤝 Contributing

1. `git checkout -b feature/your-lab`
2. Add your lesson/lab in `server/data/` (or a page in `client/src/pages/`)
3. `git commit -m "add: <what>"` && `git push`
4. Open a Pull Request — describe the lab, target and safety notes.
