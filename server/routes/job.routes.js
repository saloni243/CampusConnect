import express from "express";

import {
  createJob,
  getJobs,
  getJobById,
   getCompanyJobs,
   updateJob,
   deleteJob,
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

router.get(
    "/company/my-jobs",
    protect,
    authorize("company"),
    getCompanyJobs
);

// Get Saved Jobs
router.get(
  "/saved",
  protect,
  getSavedJobs
);


router.get(
  "/:id",
  protect,
  getJobById
);


// Get Single Job
router.put(
    "/:id",
    protect,
    authorize("company"),
    updateJob
);

router.delete(
    "/:id",
    protect,
    authorize("company"),
    deleteJob
);

// Save Job
router.post(
  "/save/:jobId",
  protect,
  saveJob
);


// Remove Saved Job
router.delete(
  "/saved/:jobId",
  protect,
  removeSavedJob
);

export default router;