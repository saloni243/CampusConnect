import { fileURLToPath } from "url";
import { dirname, join } from "path";
import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import jobRoutes from "./routes/job.routes.js";
import applicationRoutes from "./routes/application.routes.js";
import studentRoutes from "./routes/student.routes.js";
import companyRoutes from "./routes/company.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import statisticsRoutes from "./routes/statistics.routes.js";
import adminRoutes from "./routes/admin.routes.js";

// ESM-compatible __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// ── CORS ─────────────────────────────────────────────────────────────────────
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim())
  : ["http://localhost:5173"];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, Postman, curl)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error(`CORS blocked: ${origin}`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ── Body Parsing ──────────────────────────────────────────────────────────────
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ── Static Files ──────────────────────────────────────────────────────────────
// Serve uploaded files (local fallback — use Cloudinary in production)
app.use("/uploads", express.static(join(__dirname, "uploads")));

// In production, serve the compiled React client
if (process.env.NODE_ENV === "production") {
  const clientDist = join(__dirname, "..", "client", "dist");
  app.use(express.static(clientDist));
}

// ── API Routes ────────────────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/statistics", statisticsRoutes);
app.use("/api/company", companyRoutes);
app.use("/api/admin", adminRoutes);

// ── API Health Check ──────────────────────────────────────────────────────────
app.get("/api", (req, res) => {
  res.json({
    success: true,
    message: "CampusConnect API is running",
    version: "1.0.0",
    environment: process.env.NODE_ENV || "development",
  });
});

// ── SPA Fallback (Production) ─────────────────────────────────────────────────
// For any non-API route in production, serve the React app
if (process.env.NODE_ENV === "production") {
  app.get("*", (req, res) => {
    res.sendFile(join(__dirname, "..", "client", "dist", "index.html"));
  });
} else {
  // Development 404 for non-API routes
  app.use("/api/*", (req, res) => {
    res.status(404).json({ success: false, message: "API route not found" });
  });
}

// ── Global Error Handler ──────────────────────────────────────────────────────
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(`[ERROR] ${err.message}`);

  if (err.name === "ValidationError") {
    return res.status(400).json({ success: false, message: err.message });
  }
  if (err.name === "CastError") {
    return res.status(400).json({ success: false, message: "Invalid ID format" });
  }
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || "field";
    return res.status(409).json({
      success: false,
      message: `Duplicate value for ${field}. Please use a different value.`,
    });
  }
  if (err.message?.startsWith("CORS blocked")) {
    return res.status(403).json({ success: false, message: err.message });
  }

  res.status(err.status || 500).json({
    success: false,
    message:
      process.env.NODE_ENV === "production"
        ? "Internal server error"
        : err.message,
  });
});

export default app;