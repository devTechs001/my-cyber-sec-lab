#!/usr/bin/env python3
"""
Simple auth-log analyzer — Cyber EC Lab.

Parses an SSH auth log (e.g. /var/log/auth.log on YOUR OWN machine) and reports
failed-login counts per source IP — the same idea behind fail2ban.

Usage:
    python3 log_analyzer.py /var/log/auth.log
    python3 log_analyzer.py auth.log.sample   # bundled sample
"""
import re
import sys
from collections import Counter

FAILED_RE = re.compile(r"Failed password for (?:invalid user )?(\S+) from (\d+\.\d+\.\d+\.\d+)")


def analyze(path: str) -> int:
    counts: Counter[str] = Counter()
    total = 0
    with open(path, "r", errors="ignore") as fh:
        for line in fh:
            m = FAILED_RE.search(line)
            if m:
                counts[m.group(2)] += 1
                total += 1
    print(f"[*] {total} failed login attempts in {path}")
    for ip, n in counts.most_common(10):
        bar = "#" * min(n, 40)
        print(f"    {ip:<16} {n:>4}  {bar}")
    if counts:
        top_ip, top_n = counts.most_common(1)[0]
        print(f"[*] Top source: {top_ip} ({top_n} attempts) -> consider fail2ban / firewall block")
    return 0


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print(__doc__)
        sys.exit(1)
    sys.exit(analyze(sys.argv[1]))
