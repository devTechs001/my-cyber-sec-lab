# Processes & Methodology — Cyber EC Lab

How a professional ethical-hacking engagement (and this lab) is structured.

## The engagement lifecycle

1. **Scope & authorization** — written rules of engagement: targets, methods, time window, contacts. *No written permission = no testing.*
2. **Reconnaissance** — passive OSINT first (WHOIS, DNS, CT logs), active only when allowed.
3. **Scanning & enumeration** — Nmap, service banners, directory brute-force (Gobuster) on in-scope hosts.
4. **Vulnerability analysis** — map findings to CVEs/CWEs; prioritize by exploitability + impact.
5. **Exploitation** — Burp Suite for web, Metasploit for services; lab VMs or authorized targets only.
6. **Post-exploitation & privilege escalation** — establish persistence *only in lab/authorized tests*, escalate, collect proof (flags).
7. **Reporting** — findings with PoC, CVSS, impact, remediation; see `report-template.md`.
8. **Remediation & retest** — verify fixes; responsible disclosure timelines for external bugs.

## Rules of engagement (this lab)

- Test **only** systems you own or have explicit written authorization for.
- Preferred targets: your own VMs (Metasploitable2, DVWA in Docker), HackTheBox, TryHackMe.
- Never expose intentionally vulnerable VMs (DVWA, Metasploitable) to the internet.
- Never attack cloud tenants, employers, or third parties without a contract.
- Intercepting or cracking others' data/traffic/passwords is a crime in most countries.

## Daily lab workflow

1. Snapshot your lab VMs before a session.
2. One objective per session (e.g., "dump the users table via SQLi").
3. Take notes as you go — commands + output.
4. Restore the snapshot afterwards; document cleanup.
5. Turn each completed lab into a portfolio write-up.

## Useful checklists

- **Recon**: `whois`, `dig ANY`, `theHarvester`, crt.sh, subdomain enumeration.
- **Scanning**: `nmap -sV -O`, NSE non-intrusive scripts first.
- **Web**: OWASP Top 10 — A01 broken access control, A02 crypto failures, A03 injection, A05 misconfig, A07 auth failures…
- **Privesc (Linux)**: `sudo -l`, SUID find, cron jobs, kernel exploits, GTFOBins.
