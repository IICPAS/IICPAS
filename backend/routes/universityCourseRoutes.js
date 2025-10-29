import express from "express";
import {
  getAllUniversityCourses,
  getUniversityCourseBySlug,
  createUniversityCourse,
  updateUniversityCourse,
  deleteUniversityCourse,
} from "../controllers/universityCourseController.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { isAdmin } from "../middleware/isAdmin.js";

const router = express.Router();

// Public routes
router.get("/", getAllUniversityCourses);
router.get("/:slug", getUniversityCourseBySlug);

// Admin-only routes
router.post("/", requireAuth, isAdmin, createUniversityCourse);
router.put("/:slug", requireAuth, isAdmin, updateUniversityCourse);
router.delete("/:slug", requireAuth, isAdmin, deleteUniversityCourse);

export default router;
