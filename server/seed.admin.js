/**
 * Admin Seed Script — CampusConnect
 * Creates the default TPO/Admin account in MongoDB.
 *
 * Usage: node seed.admin.js
 *
 * Default credentials:
 *   Email:    admin@campusconnect.edu
 *   Password: Admin@123
 */

import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// ── inline User model (avoids ES-module circular issues) ─────────────────────
const userSchema = new mongoose.Schema(
  {
    name:     { type: String, required: true, trim: true },
    email:    { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role:     { type: String, enum: ["student", "company", "admin"], default: "student" },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

// ── connection ────────────────────────────────────────────────────────────────
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/campusconnect";

try {
  await mongoose.connect(MONGO_URI);
  console.log("✅  Connected to MongoDB:", MONGO_URI);
} catch (err) {
  console.error("❌  MongoDB connection error:", err.message);
  process.exit(1);
}

// ── credentials ───────────────────────────────────────────────────────────────
const ADMIN_NAME     = "TPO Admin";
const ADMIN_EMAIL    = "admin@campusconnect.edu";
const ADMIN_PASSWORD = "Admin@123";

// ── seed ──────────────────────────────────────────────────────────────────────
try {
  const exists = await User.findOne({ email: ADMIN_EMAIL });

  if (exists) {
    if (exists.role === "admin") {
      console.log("ℹ️   Admin account already exists:");
      console.log("    Email   :", ADMIN_EMAIL);
      console.log("    Password: Admin@123  (unchanged)");
    } else {
      // Upgrade the existing user to admin role
      exists.role = "admin";
      await exists.save();
      console.log("✅  Existing user upgraded to admin role:", ADMIN_EMAIL);
    }
  } else {
    const hashed = await bcrypt.hash(ADMIN_PASSWORD, 10);
    await User.create({
      name:     ADMIN_NAME,
      email:    ADMIN_EMAIL,
      password: hashed,
      role:     "admin",
    });

    console.log("✅  Admin account created successfully!");
    console.log("────────────────────────────────────────");
    console.log("    Name    :", ADMIN_NAME);
    console.log("    Email   :", ADMIN_EMAIL);
    console.log("    Password:", ADMIN_PASSWORD);
    console.log("    Login at: http://localhost:5173/admin/login");
    console.log("────────────────────────────────────────");
  }
} catch (err) {
  console.error("❌  Seed error:", err.message);
} finally {
  await mongoose.disconnect();
  console.log("🔌  Disconnected from MongoDB.");
}
