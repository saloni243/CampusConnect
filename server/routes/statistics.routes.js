import express from "express";
import { protect, authorize } from "../middleware/auth.middleware.js";

import {
    getPlacementStatistics,
    getCompanyStatistics,
    getOverallStatistics,
    getMonthlyAnalytics
} from "../controllers/statistics.controller.js";

const router = express.Router();

// Student Statistics
router.get(
    "/",
    protect,
    authorize("student"),
    getPlacementStatistics
);

// Company Statistics
router.get(
    "/company",
    protect,
    authorize("company"),
    getCompanyStatistics
);

// Overall Statistics
router.get(
    "/overall",
    protect,
    getOverallStatistics
);

// Monthly Analytics
router.get(
    "/monthly",
    protect,
    getMonthlyAnalytics
);

export default router;