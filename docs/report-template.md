# Penetration Test Report — Template

> Copy this file per engagement/lab and fill it in. A strong report is the #1 portfolio asset.

## 1. Executive summary
- Client/lab, date, tester, scope in one paragraph.
- Top 3 risks in plain language + business impact.

## 2. Scope & authorization
- In-scope IPs/hosts/apps, out-of-scope items, testing window, rules of engagement reference.

## 3. Methodology
- Phases used: recon → scan → exploit → privesc → report (see `processes.md`).
- Tools: Nmap, Burp Suite, Wireshark, Metasploit, custom Python scripts…

## 4. Findings
For each finding:

### F-001 — <Title> — Severity: Critical (CVSS 9.x)
- **Location**: URL/host/port/parameter
- **Description**: what the flaw is
- **Proof of concept**: exact request/payload + sanitized screenshot or command output
- **Impact**: what an attacker could do
- **Remediation**: concrete fix (patch, config, code change)
- **References**: CWE/CVE/OWASP links

## 5. Attack chain narrative (optional)
How low-severity findings chained into full compromise.

## 6. Appendix
- Scan outputs (`nmap -oA`), tool versions, lab setup, cleanup/restore notes.

## 7. Responsible disclosure
- For external bugs: vendor security contact, CVD timeline (typically 90 days), never publish unpatched 0-days.
- Use FIRST.org CVSS v3.1 calculator for scores.
