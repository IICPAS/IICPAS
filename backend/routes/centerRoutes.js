import express from "express";
import {
  getAllCenters,
  getCenterById,
  createCenter,
  updateCenter,
  deleteCenter,
  getPublicCenters,
  getAvailableCourses
} from "../controllers/centerController.js";
import { isAdmin } from "../middleware/isAdmin.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = express.Router();

// Public routes
router.get("/public", getPublicCenters);
router.get("/courses", getAvailableCourses);

// Admin routes (require authentication and admin role)
router.get("/", requireAuth, isAdmin, getAllCenters);
router.get("/:id", requireAuth, isAdmin, getCenterById);
router.post("/", requireAuth, isAdmin, createCenter);
router.put("/:id", requireAuth, isAdmin, updateCenter);
router.delete("/:id", requireAuth, isAdmin, deleteCenter);

export default router;