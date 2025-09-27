import express from "express";
import {
  saveChatMessage,
  getAllChatConversations,
  getChatConversation,
  updateConversationStatus,
  getChatStatistics,
  deleteConversation
} from "../controllers/chatController.js";
import { isAdmin } from "../middleware/isAdmin.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = express.Router();

// Public routes (for chatbot)
router.post("/save-message", saveChatMessage);

// Admin routes
router.get("/conversations", requireAuth, isAdmin, getAllChatConversations);
router.get("/conversations/:sessionId", requireAuth, isAdmin, getChatConversation);
router.put("/conversations/:sessionId/status", requireAuth, isAdmin, updateConversationStatus);
router.delete("/conversations/:sessionId", requireAuth, isAdmin, deleteConversation);
router.get("/statistics", requireAuth, isAdmin, getChatStatistics);

export default router;
