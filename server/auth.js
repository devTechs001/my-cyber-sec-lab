// Simple account system for Cyber EC Lab (no external deps — node:crypto only).
// Passwords are hashed with scrypt + per-user salt; sessions are random tokens.
// users.json is gitignored runtime state, like progress.json.
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const USERS_FILE = path.join(__dirname, "data", "users.json");

function loadUsers() {
  try { return JSON.parse(fs.readFileSync(USERS_FILE, "utf8")); } catch { return {}; }
}
function saveUsers(users) {
  try { fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2)); } catch { /* read-only fs */ }
}

const users = loadUsers();

const hashPassword = (password, salt) =>
  crypto.scryptSync(password, salt, 64).toString("hex");

export function register(username, password) {
  username = String(username || "").trim();
  if (!/^[a-zA-Z0-9_-]{3,20}$/.test(username))
    return { error: "Username must be 3-20 chars: letters, numbers, _ or -" };
  if (String(password || "").length < 6)
    return { error: "Password must be at least 6 characters" };
  if (users[username]) return { error: "Username already taken" };
  const salt = crypto.randomBytes(16).toString("hex");
  const token = crypto.randomBytes(24).toString("hex");
  users[username] = {
    salt,
    hash: hashPassword(String(password), salt),
    token,
    createdAt: new Date().toISOString(),
  };
  saveUsers(users);
  return { username, token };
}

export function login(username, password) {
  const u = users[String(username || "").trim()];
  if (!u) return { error: "Invalid username or password" };
  const candidate = hashPassword(String(password || ""), u.salt);
  const a = Buffer.from(candidate, "hex");
  const b = Buffer.from(u.hash, "hex");
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b))
    return { error: "Invalid username or password" };
  u.token = crypto.randomBytes(24).toString("hex"); // rotate token on each login
  saveUsers(users);
  return { username: String(username).trim(), token: u.token };
}

export function logout(token) {
  for (const [name, u] of Object.entries(users)) {
    if (u.token === token) { u.token = null; }
  }
  saveUsers(users);
}

export function userByToken(token) {
  if (!token) return null;
  for (const [name, u] of Object.entries(users)) {
    if (u.token && u.token === token) return { username: name };
  }
  return null;
}

export function authMiddleware(req, _res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  req.user = userByToken(token);
  req.token = token;
  next();
}
