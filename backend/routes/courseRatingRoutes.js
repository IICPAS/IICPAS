import express from "express";
import {
  getPendingRatings,
  getAllRatings,
  approveRating,
  rejectRating,
  submitRating,
  getCourseRatings,
  getStudentRatings,
} from "../controllers/courseRatingController.js";
import { isAdmin } from "../middleware/isAdmin.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = express.Router();

// Admin routes (no authentication required)
router.get("/admin/pending", getPendingRatings);
router.get("/admin/all", getAllRatings);
router.patch("/admin/approve/:ratingId", approveRating);
router.patch("/admin/reject/:ratingId", rejectRating);

// Public routes
router.post("/submit", submitRating);
router.get("/course/:courseId", getCourseRatings);
router.get("/student/:studentId", getStudentRatings);

export default router;
