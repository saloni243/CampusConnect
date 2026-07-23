import express from "express";
import {
  applyJob,
  getApplicants,
  updateApplicationStatus,
  cancelApplication,
  getMyApplications,
  getApplicationStatus,
} from "../controllers/application.controller.js";

import { protect, authorize } from "../middleware/auth.middleware.js";

const router = express.Router();

// ================= Student =================

// Apply for Job
router.post(
  "/apply/:jobId",
  protect,
  authorize("student"),
  applyJob
);

// Cancel Application
router.delete(
  "/cancel/:jobId",
  protect,
  authorize("student"),
  cancelApplication
);

// Get My Applications
router.get(
  "/my-applications",
  protect,
  authorize("student"),
  getMyApplications
);

// Check Application Status
router.get(
  "/status/:jobId",
  protect,
  authorize("student"),
  getApplicationStatus
);

// ================= Company =================

// View Applicants of a Job
router.get(
  "/job/:jobId/applicants",
  protect,
  authorize("company"),
  getApplicants
);

// Update Application Status
router.put(
  "/status/:applicationId",
  protect,
  authorize("company"),
  updateApplicationStatus
);

export default router;