import express from "express";

import {
  createJob,
  getJobs,
  getJobById,
  searchJobs,
  filterJobs,
  saveJob,
  getSavedJobs,
  removeSavedJob
} from "../controllers/job.controller.js";

import { protect, authorize } from "../middleware/auth.middleware.js";

const router = express.Router();

/* ===========================
   Company Routes
=========================== */

// Create Job
router.post(
  "/",
  protect,
  authorize("company"),
  createJob
);

/* ===========================
   Student Routes
=========================== */

// Get All Jobs
router.get(
  "/",
  protect,
  getJobs
);

// Search Jobs
router.get(
  "/search/jobs",
  protect,
  searchJobs
);

// Filter Jobs
router.get(
  "/filter/jobs",
  protect,
  filterJobs
);

// Get Single Job
router.get("/:id", protect, getJobById);

// Save Job
router.post(
  "/save/:jobId",
  protect,
  saveJob
);

// Get Saved Jobs
router.get(
  "/saved",
  protect,
  getSavedJobs
);

// Remove Saved Job
router.delete(
  "/saved/:jobId",
  protect,
  removeSavedJob
);

export default router;