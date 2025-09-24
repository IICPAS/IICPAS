import express from "express";
import {
  createLiveSession,
  getAllLiveSessions,
  getLiveSessionById,
  enrollInLiveSession,
  unenrollFromLiveSession,
  updateLiveSession,
  deleteLiveSession,
  toggleStatus,
} from "../../controllers/LiveSessionController/LiveSesionController.js";

const router = express.Router();

// Get all live sessions
router.get("/", getAllLiveSessions);

// Get single live session by ID
router.get("/:id", getLiveSessionById);

// Create new live session
router.post("/", createLiveSession);

// Enroll in live session
router.post("/:id/enroll", enrollInLiveSession);

// Unenroll from live session
router.post("/:id/unenroll", unenrollFromLiveSession);

// Update live session
router.patch("/:id", updateLiveSession);

// Delete live session
router.delete("/:id", deleteLiveSession);

// Toggle session status
router.patch("/toggle/:id", toggleStatus);

export default router;
