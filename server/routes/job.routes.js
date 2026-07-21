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

import { protect, isCompany } from "../middleware/auth.middleware.js";

const router = express.Router();

// Company
router.post("/", protect, isCompany, createJob);

// Student
router.get("/", protect, getJobs);
router.get("/search/jobs", protect, searchJobs);
router.get("/filter/jobs", protect, filterJobs);
router.get("/:id", protect, getJobById);
router.post("/save/:jobId",protect,saveJob);

router.get( "/saved",protect,getSavedJobs);

router.delete( "/saved/:jobId",protect,removeSavedJob);


export default router;