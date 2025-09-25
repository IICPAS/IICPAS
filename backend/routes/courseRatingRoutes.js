import express from "express";
import {
  getPendingRatings,
  getAllRatings,
  approveRating,
  rejectRating,
  submitRating,
  getCourseRatings,
  getStudentRatings
} from "../controllers/courseRatingController.js";
import { isAdmin } from "../middleware/isAdmin.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = express.Router();

// Admin routes (require admin authentication)
router.get("/admin/pending", requireAuth, isAdmin, getPendingRatings);
router.get("/admin/all", requireAuth, isAdmin, getAllRatings);
router.patch("/admin/approve/:ratingId", requireAuth, isAdmin, approveRating);
router.patch("/admin/reject/:ratingId", requireAuth, isAdmin, rejectRating);

// Public routes
router.post("/submit", submitRating);
router.get("/course/:courseId", getCourseRatings);
router.get("/student/:studentId", getStudentRatings);

export default router;
