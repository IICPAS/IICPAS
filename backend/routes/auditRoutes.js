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

// Debug endpoint to see what data is being sent
router.post("/debug", (req, res) => {
  console.log("🔍 DEBUG - Request body:", JSON.stringify(req.body, null, 2));
  console.log("🔍 DEBUG - Request headers:", req.headers);
  res.json({
    success: true,
    message: "Debug data received",
    body: req.body,
    headers: req.headers,
  });
});

// Public routes (no auth required for now)
router.get("/activities", getAuditActivities);
router.get("/stats", getAuditStats);
router.get("/user/:userId/summary/:days", getUserActivitySummary);
router.get("/user/:userId/summary", getUserActivitySummary);
router.get("/ip/:ip/summary/:days", getIPActivitySummary);
router.get("/ip/:ip/summary", getIPActivitySummary);
router.delete("/activities", deleteAuditActivities);

export default router;
