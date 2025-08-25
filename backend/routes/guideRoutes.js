import express from "express";
import {
  getAllGuides,
  getGuidesByCategory,
  getGuideById,
  createGuide,
  updateGuide,
  deleteGuide,
  toggleGuideStatus,
  updateGuideOrder,
  incrementDownloads,
  incrementViews
} from "../controllers/guideController.js";

const router = express.Router();

// Get all guides
router.get("/", getAllGuides);

// Get guides by category
router.get("/category/:category", getGuidesByCategory);

// Get single guide
router.get("/:id", getGuideById);

// Create new guide
router.post("/", createGuide);

// Update guide
router.put("/:id", updateGuide);

// Delete guide
router.delete("/:id", deleteGuide);

// Toggle guide status
router.put("/:id/toggle-status", toggleGuideStatus);

// Update guide order
router.put("/order/update", updateGuideOrder);

// Increment download count
router.put("/:id/increment-downloads", incrementDownloads);

// Increment view count
router.put("/:id/increment-views", incrementViews);

export default router;
