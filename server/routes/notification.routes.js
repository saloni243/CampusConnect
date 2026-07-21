import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import {
    getNotifications,
    markAsRead
} from "../controllers/notification.controller.js";

const router=express.Router();

router.get("/",protect,getNotifications);

router.put("/:id",protect,markAsRead);

export default router;