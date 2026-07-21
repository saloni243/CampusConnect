import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { getCompanies, getCompanyById , getMyApplications , getApplicationStatus} from "../controllers/company.controller.js";
import { searchCompanies } from "../controllers/company.controller.js"; 

const router = express.Router();

router.get("/", protect, getCompanies);
router.get("/:id", protect, getCompanyById);
router.get("/search/company", protect, searchCompanies);
router.get("/my-applications", protect,getMyApplications);

router.get("/status/:jobId",protect,getApplicationStatus);
export default router;