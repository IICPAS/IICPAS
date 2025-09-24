import express from "express";
import {
  getAllCenters,
  getCenterById,
  createCenter,
  updateCenter,
  deleteCenter,
  getPublicCenters,
  getAvailableCourses,
} from "../controllers/centerController.js";

const router = express.Router();

// Public routes
router.get("/public", getPublicCenters);
router.get("/courses", getAvailableCourses);

// Admin routes (no authentication required)
router.get("/", getAllCenters);
router.get("/:id", getCenterById);
router.post("/", createCenter);
router.put("/:id", updateCenter);
router.delete("/:id", deleteCenter);

export default router;
