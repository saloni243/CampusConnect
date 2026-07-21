import express from "express";
import {
  applyJob,
  getApplicants,
  updateApplicationStatus,
  cancelApplication,
  getMyApplications,
  getApplicationStatus
} from "../controllers/application.controller.js";

import { protect, authorize } from "../middleware/auth.middleware.js";

const router = express.Router();

// 🎓 Student
router.post("/apply/:jobId", protect, authorize("student"), applyJob);

router.delete("/cancel/:jobId", protect, authorize("student"), cancelApplication);

router.get("/my-applications", protect, authorize("student"), getMyApplications);

router.get("/status/:jobId", protect, authorize("student"), getApplicationStatus);

router.get("/applicants/:jobId", protect, authorize("company"), getApplicants);

router.put("/status", protect, authorize("company"), updateApplicationStatus);

export default router;