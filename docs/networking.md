# Networking Fundamentals — Cyber EC Lab

The base layer of every attack and every defense.

## 1. OSI model (7 layers) and where security lives

| Layer | Name | Examples | Security controls |
|---|---|---|---|
| L7 | Application | HTTP, DNS, SMTP, SSH | WAF, input validation, TLS |
| L6 | Presentation | TLS/SSL, encoding | Encryption, certificate validation |
| L5 | Session | Session cookies, RPC | Session timeouts, management |
| L4 | Transport | TCP, UDP, ports | Stateful firewalls, port filtering |
| L3 | Network | IP, ICMP, routing | ACLs, segmentation, IPS |
| L2 | Data Link | Ethernet, ARP, MAC | VLANs, port security |
| L1 | Physical | Cables, radio | Physical access control |

## 2. TCP/IP essentials

- **TCP** is connection-oriented: 3-way handshake `SYN → SYN-ACK → ACK`, reliable delivery, used by HTTP/SSH/SMTP.
- **UDP** is connectionless and fast: DNS, DHCP, VoIP, streaming.
- **IP addressing**: IPv4 (32-bit, e.g. 192.168.1.10) with CIDR notation (`/24` = 255.255.255.0).
- **Subnetting formula**: usable hosts = `2^(32 − prefix) − 2` (network + broadcast).
  - `/24` → 254 usable · `/26` → 62 · `/27` → 30 · `/28` → 14
  - Example: `10.0.0.0/26` → hosts `10.0.0.1 – 10.0.0.62`, broadcast `10.0.0.63`.

## 3. Ports you must know

| Port | Service | | Port | Service |
|---|---|---|---|---|
| 21 | FTP | | 445 | SMB (Windows shares) |
| 22 | SSH | | 3306 | MySQL |
| 23 | Telnet (**insecure**) | | 3389 | RDP |
| 25 | SMTP | | 5432 | PostgreSQL |
| 53 | DNS (TCP/UDP) | | 8080 | HTTP alt / Burp proxy |
| 80 | HTTP | | 27017 | MongoDB |
| 443 | HTTPS | | | |

## 4. Key protocol flows

- **DNS**: client → resolver → root → TLD → authoritative server → IP returned.
- **TLS handshake**: ClientHello → ServerHello + certificate → key exchange → encrypted data (Wireshark can see the handshake, not TLS 1.3 contents).
- **HTTP**: request = method + path + headers + body; response = status + headers + body.

## 5. Hardening checklist

1. Disable unused services; close unused ports (default-deny firewall).
2. Replace Telnet/FTP/HTTP with SSH/SFTP/HTTPS.
3. Segment with VLANs; restrict east-west traffic.
4. MFA everywhere — especially SSH/RDP/VPN.
5. Patch OS and services on a schedule.
6. Centralize logs (syslog/SIEM) and alert on anomalies.

## 6. Practice commands (your own machine/lab)

```bash
ip addr show                 # interfaces & IPs
ping -c 4 8.8.8.8            # reachability (ICMP)
traceroute 8.8.8.8           # path packets take
ss -tulnp                    # listening ports + processes
dig example.com              # DNS records
curl -I https://example.com   # HTTP response headers
```
