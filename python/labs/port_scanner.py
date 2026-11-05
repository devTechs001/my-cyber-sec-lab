#!/usr/bin/env python3
"""
Educational TCP port scanner — Cyber EC Lab.

ETHICS: Run ONLY against hosts you own or are explicitly authorized to scan
(e.g., your own lab VMs on a host-only network). Unauthorized port scanning
is illegal in most jurisdictions.

Usage:
    python3 port_scanner.py 192.168.56.101            # default ports
    python3 port_scanner.py 127.0.0.1 --ports 22,80,443
    python3 port_scanner.py 127.0.0.1 --top 100        # top 100 common ports
"""
import argparse
import socket
import sys
from concurrent.futures import ThreadPoolExecutor

TOP_PORTS = [
    21, 22, 23, 25, 53, 80, 110, 135, 139, 143, 443, 445, 993, 995, 1723,
    3306, 3389, 5432, 5900, 6379, 8080, 8443, 27017,
]


def scan_port(host: str, port: int, timeout: float = 1.0) -> tuple[int, str]:
    """Return (port, status) — 'open' if the TCP connect succeeds."""
    try:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            s.settimeout(timeout)
            result = s.connect_ex((host, port))
            return port, "open" if result == 0 else "closed"
    except socket.gaierror:
        return port, "invalid-host"
    except OSError:
        return port, "error"


def main() -> int:
    parser = argparse.ArgumentParser(description="Educational lab port scanner (authorized targets only)")
    parser.add_argument("host", help="Target host — must be one you own/authorized (e.g. 127.0.0.1)")
    parser.add_argument("--ports", help="Comma-separated ports, e.g. 22,80,443")
    parser.add_argument("--top", type=int, help="Scan the top N common ports")
    args = parser.parse_args()

    if args.ports:
        ports = [int(p) for p in args.ports.split(",")]
    elif args.top:
        ports = TOP_PORTS[: args.top]
    else:
        ports = TOP_PORTS

    print(f"[*] Scanning {args.host} ({len(ports)} ports) — lab use only")
    open_ports = []
    with ThreadPoolExecutor(max_workers=50) as pool:
        for port, status in pool.map(lambda p: scan_port(args.host, p), ports):
            if status == "open":
                print(f"[+] {args.host}:{port}  OPEN")
                open_ports.append(port)
            elif status == "invalid-host":
                print("[!] Could not resolve host.")
                return 1
    print(f"[*] Done. {len(open_ports)} open port(s): {open_ports or 'none'}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
