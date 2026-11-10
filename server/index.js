// Cyber EC Lab — Express API server
// Serves lesson/lab/tool/networking data and (in production) the built React client.
// Deploy to Render: set Start Command = "npm start" in server/ (or repo root with rootDir).
import express from "express";
import cors from "cors";
import morgan from "morgan";
import path from "node:path";
import { fileURLToPath } from "node:url";
import apiRoutes from "./routes/api.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Allow the Netlify frontend (and any origin in dev) to call the API.
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:4173",
  process.env.CLIENT_URL, // e.g. https://your-site.netlify.app
].filter(Boolean);

app.use(
  cors({
    origin(origin, cb) {
      // allow non-browser clients (curl, Postman) and whitelisted origins
      if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
      return cb(null, true); // open read-only API; tighten for production writes
    },
  })
);
app.use(express.json());
app.use(morgan("dev"));

// Security headers (mirrors netlify.toml for the full-stack/self-hosted mode)
app.use((_req, res, next) => {
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:; connect-src 'self' https://*.onrender.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self'"
  );
  next();
});

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "cyber-ec-lab-api", time: new Date().toISOString() });
});

app.use("/api", apiRoutes);

// Serve the built React client when deployed together (Render full-stack mode)
const clientDist = path.join(__dirname, "..", "client", "dist");
app.use(express.static(clientDist));
app.get("*", (_req, res) => {
  res.sendFile(path.join(clientDist, "index.html"), (err) => {
    if (err) res.status(404).json({ error: "API only — build the client or use /api routes" });
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`[cyber-ec-lab] API listening on http://0.0.0.0:${PORT}`);
});
