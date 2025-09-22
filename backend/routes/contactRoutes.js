// routes/contactRoutes.js
import express from "express";
import {
  submitContactForm,
  getAllContacts,
  getAllMessages,
  replyToMessage,
} from "../controllers/contactController.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { isAdmin } from "../middleware/isAdmin.js";

const router = express.Router();

// Public routes
router.post("/", submitContactForm);

// Admin routes
router.get("/", requireAuth, isAdmin, getAllContacts);
router.get("/messages", requireAuth, isAdmin, getAllMessages);
router.put("/messages/:id/reply", requireAuth, isAdmin, replyToMessage);

export default router;
