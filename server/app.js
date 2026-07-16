import express from "express";
import authRoutes from "./routes/auth.routes.js";
import jobRoutes from "./routes/job.routes.js";

const app = express();

app.use(express.json()); // VERY IMPORTANT

app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);

export default app;