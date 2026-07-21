
// Then import routes, database, etc.

import path from "path";
import express from "express";

import authRoutes from "./routes/auth.routes.js";
import jobRoutes from "./routes/job.routes.js";
import applicationRoutes from "./routes/application.routes.js";
import studentRoutes from "./routes/student.routes.js";
import companyRoutes from "./routes/company.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import statisticsRoutes from "./routes/statistics.routes.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/notifications",notificationRoutes);
app.use("/api/statistics", statisticsRoutes);
app.use("/api/company", companyRoutes);



app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "CampusConnect API Running",
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route Not Found",
  });
});




export default app;