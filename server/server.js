import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import connectDB from "./config/db.js";

const PORT = process.env.PORT || 5000;

// Connect to MongoDB then start server
try {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`✅  Server running on port ${PORT} [${process.env.NODE_ENV || "development"}]`);
    console.log(`📡  API: http://localhost:${PORT}/api`);
  });
} catch (err) {
  console.error("❌  Failed to start server:", err.message);
  process.exit(1);
}

// Handle uncaught exceptions & rejections gracefully
process.on("uncaughtException", (err) => {
  console.error("❌  Uncaught Exception:", err.message);
  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  console.error("❌  Unhandled Rejection:", reason);
  process.exit(1);
});