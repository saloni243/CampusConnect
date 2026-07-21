import express from "express";

import {
  getProfile,
  updateProfile,
  uploadResume,
  replaceResume,
  deleteResume,
  previewResume,
  downloadResume,
  uploadProfilePic,
  replaceProfilePic,
  deleteProfilePic,
  addSkill,
  getSkills,
  updateSkill,
  deleteSkill,
  
} from "../controllers/student.controller.js";

import { protect } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/upload.middleware.js";
import {profileUpload} from "../middleware/profileUpload.middleware.js";

const router = express.Router();

router.get("/profile", protect, getProfile);

router.put("/profile", protect, updateProfile);

router.post(
  "/upload-file",
  protect,
  upload.single("file"),
  uploadResume
);

router.put(
    "/replace-resume",
    protect,
    upload.single("file"),
    replaceResume
);

router.delete(
    "/delete-resume",
    protect,
    deleteResume
);

router.get(
    "/preview-resume",
    protect,
    previewResume
);

router.get(
    "/download-resume",
    protect,
    downloadResume
);

router.post(
    "/upload-profile",
    protect,
    profileUpload.single("profile"),
    uploadProfilePic
);

router.put(
    "/replace-profile",
    protect,
    profileUpload.single("profile"),
    replaceProfilePic
);

router.delete(
    "/delete-profile",
    protect,
    deleteProfilePic
);

// ================= Skills =================

// Add Skill
router.post(
    "/skills",
    protect,
    addSkill
);

// Get Skills
router.get(
    "/skills",
    protect,
    getSkills
);

// Update Skill
router.put(
    "/skills/:index",
    protect,
    updateSkill
);

// Delete Skill
router.delete(
    "/skills/:index",
    protect,
    deleteSkill
);



export default router;