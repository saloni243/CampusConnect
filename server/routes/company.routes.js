import express from "express";
import { protect, authorize } from "../middleware/auth.middleware.js";
import { logoUpload } from "../middleware/logoUpload.middleware.js";

import {
  getCompanies,
  getCompanyById,
  searchCompanies,
  getCompanyProfile,
  updateCompanyProfile,
  uploadCompanyLogo
} from "../controllers/company.controller.js";

const router = express.Router();

router.get("/", protect, getCompanies);

router.get("/search/company", protect, searchCompanies);

router.get(
  "/profile",
  protect,
  authorize("company"),
  getCompanyProfile
);

router.put(
  "/profile",
  protect,
  authorize("company"),
  updateCompanyProfile
);

// company.routes.js

router.put(
  "/logo",
  protect,
  authorize("company"),
  logoUpload.single("logo"),
  uploadCompanyLogo
);
router.get("/:id", protect, getCompanyById);

export default router;