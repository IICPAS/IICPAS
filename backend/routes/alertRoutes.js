// routes/alertRoutes.js
import express from "express";
import {
  getAlerts,
  createAlert,
  deleteAlert,
  updateAlertStatus,
} from "../controllers/alertController.js";

const router = express.Router();

// GET /api/alerts – list all alerts
router.get("/alerts", getAlerts);

// POST /api/alerts – create a new alert
router.post("/alerts", createAlert);

// DELETE /api/alerts/:id – delete a specific alert
router.delete("/alerts/:id", deleteAlert);

// PATCH /api/alerts/:id – update alert status (active/inactive)
router.patch("/alerts/:id", updateAlertStatus);

export default router;
