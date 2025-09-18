import express from "express";
import {
  subscribeNewsletter,
  getAllSubscriptions,
  getSubscriptionStats,
  updateSubscriptionStatus,
  unsubscribeNewsletter,
  deleteSubscription
} from "../controllers/NewsletterSubscriptionController.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { isAdmin } from "../middleware/isAdmin.js";

const router = express.Router();

// Public routes
router.post("/subscribe", subscribeNewsletter);
router.post("/unsubscribe", unsubscribeNewsletter);

// Admin routes
router.get("/", requireAuth, isAdmin, getAllSubscriptions);
router.get("/stats", requireAuth, isAdmin, getSubscriptionStats);
router.put("/:id/status", requireAuth, isAdmin, updateSubscriptionStatus);
router.delete("/:id", requireAuth, isAdmin, deleteSubscription);

export default router;
