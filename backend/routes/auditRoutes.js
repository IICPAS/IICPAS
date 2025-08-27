import express from "express";
import {
  trackActivity,
  getAuditActivities,
  getAuditStats,
  getUserActivitySummary,
  getIPActivitySummary,
  deleteAuditActivities,
} from "../controllers/auditController.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { isAdmin } from "../middleware/isAdmin.js";

const router = express.Router();

// Public route for tracking activities (no auth required)
router.post("/track", trackActivity);
router.post("/audit-log", trackActivity); // Alias for triostack-audit-sdk compatibility

// Public routes (no auth required for now)
router.get("/activities", getAuditActivities);
router.get("/stats", getAuditStats);
router.get("/user/:userId/summary/:days", getUserActivitySummary);
router.get("/user/:userId/summary", getUserActivitySummary);
router.get("/ip/:ip/summary/:days", getIPActivitySummary);
router.get("/ip/:ip/summary", getIPActivitySummary);
router.delete("/activities", deleteAuditActivities);

export default router;
