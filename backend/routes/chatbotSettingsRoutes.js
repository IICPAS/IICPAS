import express from "express";
import {
  getChatbotSettings,
  updateChatbotSettings,
  uploadChatbotImage,
  upload
} from "../controllers/chatbotSettingsController.js";
import { isAdmin } from "../middleware/isAdmin.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = express.Router();

// Public route to get chatbot settings (for frontend chatbot)
router.get("/settings", getChatbotSettings);

// Admin routes
router.get("/admin/settings", requireAuth, isAdmin, getChatbotSettings);
router.post("/settings", requireAuth, isAdmin, updateChatbotSettings);
router.post("/upload/chatbot-image", requireAuth, isAdmin, upload.single("image"), uploadChatbotImage);

export default router;

