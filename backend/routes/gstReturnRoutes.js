import express from "express";
import {
  createGSTReturn,
  getGSTReturns,
  getGSTReturn,
  updateGSTReturn,
  updateLearningProgress,
  validateGSTReturn,
  submitGSTReturn,
  getGSTSimulationStats,
  deleteGSTReturn,
} from "../controllers/gstReturnController.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = express.Router();

// Apply authentication middleware to all routes
router.use(requireAuth);

// GST Return Management Routes
router.post("/", createGSTReturn);
router.get("/", getGSTReturns);
router.get("/stats", getGSTSimulationStats);
router.get("/:id", getGSTReturn);
router.put("/:id", updateGSTReturn);
router.delete("/:id", deleteGSTReturn);

// Learning & Progress Routes
router.patch("/:id/progress", updateLearningProgress);
router.post("/:id/validate", validateGSTReturn);
router.post("/:id/submit", submitGSTReturn);

export default router;
