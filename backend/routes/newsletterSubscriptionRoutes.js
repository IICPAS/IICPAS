import express from "express";
import {
  subscribeNewsletter,
  getAllSubscriptions,
  getSubscriptionStats,
  updateSubscriptionStatus,
  unsubscribeNewsletter,
  deleteSubscription,
  sendBulkEmail,
  getEmailCampaigns,
  getEmailCampaignDetails,
  trackEmailOpen
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

// Bulk email routes
router.post("/send-bulk-email", requireAuth, isAdmin, sendBulkEmail);
router.get("/campaigns", requireAuth, isAdmin, getEmailCampaigns);
router.get("/campaigns/:id", requireAuth, isAdmin, getEmailCampaignDetails);

// Public tracking route
router.get("/track-email/:trackingId", trackEmailOpen);

export default router;
