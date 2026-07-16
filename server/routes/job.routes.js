import express from "express";
import { createJob } from "../controllers/job.controller.js";
import { protect, isCompany } from "../middleware/auth.middleware.js";


const router = express.Router();

router.post("/", protect, isCompany, createJob);

export default router;