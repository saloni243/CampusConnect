import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { getPlacementStatistics } from "../controllers/statistics.controller.js";

const router = express.Router();

router.get("/", protect, getPlacementStatistics);

export default router;