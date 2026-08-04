import express from "express";
import { protect, authorize } from "../middleware/auth.middleware.js";
import { getAdminDashboard , getAllStudents , getStudentById , searchStudents ,  getAllCompanies , getCompanyById , searchCompanies ,  verifyCompany , getAllJobs , getJobById , toggleJobStatus ,  deleteJob
 } from "../controllers/admin.controller.js";

const router = express.Router();

// Admin Dashboard
router.get(
    "/dashboard",
    protect,
    authorize("admin"),
    getAdminDashboard
);

// Get All Students
router.get(
    "/students",
    protect,
    authorize("admin"),
    getAllStudents
);

// Search Students (Must be before :id)
router.get(
    "/students/search",
    protect,
    authorize("admin"),
    searchStudents
);

// Get Student By ID
router.get(
    "/students/:id",
    protect,
    authorize("admin"),
    getStudentById
);

// ================= COMPANY MANAGEMENT =================

// Get All Companies
router.get(
    "/companies",
    protect,
    authorize("admin"),
    getAllCompanies
);

// Search Companies
router.get(
    "/companies/search",
    protect,
    authorize("admin"),
    searchCompanies
);

// Get Company By ID
router.get(
    "/companies/:id",
    protect,
    authorize("admin"),
    getCompanyById
);

// Verify Company
router.put(
    "/companies/:id/verify",
    protect,
    authorize("admin"),
    verifyCompany
);

// ================= JOB MANAGEMENT =================

// Get All Jobs
router.get(
    "/jobs",
    protect,
    authorize("admin"),
    getAllJobs
);

// Get Job By ID
router.get(
    "/jobs/:id",
    protect,
    authorize("admin"),
    getJobById
);

// Activate / Deactivate Job
router.put(
    "/jobs/:id/status",
    protect,
    authorize("admin"),
    toggleJobStatus
);

// Delete Job
router.delete(
    "/jobs/:id",
    protect,
    authorize("admin"),
    deleteJob
);
export default router;