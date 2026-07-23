import express from "express";
import { protect,authorize } from "../middleware/auth.middleware.js";
import { getDashboard ,getCompanyDashboard} from "../controllers/dashboard.controller.js";

const router = express.Router();

router.get("/", protect, getDashboard);
router.get(
    "/company",
    protect,
    authorize("company"),
    getCompanyDashboard
);

export default router;