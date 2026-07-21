import express from "express";
import {
  applyJob,
  getMyApplications,
  getApplicants,
  updateApplicationStatus,
  cancelApplication
} from "../controllers/application.controller.js";

import { protect, authorize } from "../middleware/auth.middleware.js";

const router = express.Router();

// 🎓 Student
router.post("/apply/:jobId", protect, authorize("student"), applyJob);
router.get("/my", protect, authorize("student"), getMyApplications);

// 🏢 Company
router.get("/applicants/:jobId", protect, authorize("company"), getApplicants);
router.put("/status", protect, authorize("company"), updateApplicationStatus);
router.delete(
    "/cancel/:jobId",
    protect,
    cancelApplication
);

export default router;