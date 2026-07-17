import express from "express";

import {
  getProfile,
  updateProfile,
  uploadResume,
  uploadProfilePic,
} from "../controllers/student.controller.js";

import { protect } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/upload.middleware.js";

const router = express.Router();

router.get("/profile", protect, getProfile);

router.put("/profile", protect, updateProfile);

router.post(
  "/upload-resume",
  protect,
  upload.single("file"),
  uploadResume
);

router.post(
  "/upload-profile",
  protect,
  upload.single("file"),
  uploadProfilePic
);

export default router;