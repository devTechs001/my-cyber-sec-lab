#!/usr/bin/env python3
"""
Password hashing lab — Cyber EC Lab.

Demonstrates, using ONLY locally generated example values:
  - why fast hashes (MD5/SHA-256) are bad for passwords,
  - what a salt does,
  - how a slow, salted hash (PBKDF2 via hashlib) resists cracking.

Never use this on real password dumps. Cracking others' hashes is a crime.

Run:  python3 hash_lab.py
"""
import hashlib
import os
import time

PASSWORD = "Summer2024!"  # example password generated for this demo only


def fast_hash(pw: str) -> str:
    return hashlib.sha256(pw.encode()).hexdigest()


def salted_slow_hash(pw: str, salt: bytes | None = None, iterations: int = 200_000) -> tuple[str, str]:
    """PBKDF2-HMAC-SHA256 — a slow, salted KDF (bcrypt/argon2 are the production choices)."""
    salt = salt or os.urandom(16)
    dk = hashlib.pbkdf2_hmac("sha256", pw.encode(), salt, iterations)
    return salt.hex(), dk.hex()


def main() -> None:
    print("=== Cyber EC Lab — password hashing demo (local examples only) ===\n")

    print(f"[1] Fast unsalted SHA-256 of '{PASSWORD}':")
    h = fast_hash(PASSWORD)
    print(f"    {h}\n    -> identical every time, no salt: rainbow tables & GPU cracking win.\n")

    print("[2] Salted slow hash (PBKDF2, 200k iterations):")
    t0 = time.perf_counter()
    salt_hex, dk_hex = salted_slow_hash(PASSWORD)
    elapsed = time.perf_counter() - t0
    print(f"    salt : {salt_hex}")
    print(f"    hash : {dk_hex}")
    print(f"    took {elapsed:.3f}s for ONE guess -> ~{1/elapsed:.0f} guesses/sec on this CPU.\n")

    print("[3] Same password, different salt -> different hash (salt defeats precomputed tables):")
    _, dk2 = salted_slow_hash(PASSWORD)
    print(f"    second hash matches first? {dk2 == dk_hex}\n")

    print("[4] Defensive takeaways:")
    print("    - store passwords with bcrypt/argon2id + unique salt (never MD5/SHA-256 alone)")
    print("    - enforce long unique passphrases + MFA + rate limiting on logins")
    print("    - use a password manager so no password is ever reused\n")

    print("Next lab step: crack YOUR OWN md5 hash with John:")
    print(f"    echo -n '{PASSWORD}' | md5sum > myhash.txt")
    print("    john --wordlist=/usr/share/wordlists/rockyou.txt myhash.txt")


if __name__ == "__main__":
    main()
