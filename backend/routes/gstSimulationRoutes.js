import express from "express";
import {
  createGSTSimulation,
  getGSTSimulations,
  getGSTSimulation,
  updateGSTSimulation,
  updateLearningProgress,
  validateGSTSimulation,
  generateEInvoice,
  deleteGSTSimulation,
  getGSTSimulationStats,
} from "../controllers/gstSimulationController.js";
import { requireAuth } from "../middleware/requireAuth.js";
import isStudent from "../middleware/isStudent.js";
import { isTeacher } from "../middleware/isTeacher.js";
import { isAdmin } from "../middleware/isAdmin.js";

const router = express.Router();

// Apply authentication middleware to all routes
router.use(requireAuth);

// Create GST Simulation
// POST /api/gst-simulations
router.post("/", isTeacher, createGSTSimulation);

// Get all GST Simulations with filtering
// GET /api/gst-simulations?chapterId=xxx&difficulty=BEGINNER&page=1&limit=10
router.get("/", getGSTSimulations);

// Get GST Simulation Statistics
// GET /api/gst-simulations/stats?chapterId=xxx&createdBy=xxx
router.get("/stats", getGSTSimulationStats);

// Get single GST Simulation
// GET /api/gst-simulations/:id
router.get("/:id", getGSTSimulation);

// Update GST Simulation
// PUT /api/gst-simulations/:id
router.put("/:id", isTeacher, updateGSTSimulation);

// Update Learning Progress (for students)
// PATCH /api/gst-simulations/:id/progress
router.patch("/:id/progress", isStudent, updateLearningProgress);

// Validate GST Simulation field
// POST /api/gst-simulations/:id/validate
router.post("/:id/validate", validateGSTSimulation);

// Generate E-Invoice (Simulation)
// POST /api/gst-simulations/:id/generate-einvoice
router.post("/:id/generate-einvoice", isStudent, generateEInvoice);

// Delete GST Simulation
// DELETE /api/gst-simulations/:id
router.delete("/:id", isAdmin, deleteGSTSimulation);

export default router;
