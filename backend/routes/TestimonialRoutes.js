import express from "express";
import {
  submitTestimonial,
  getStudentTestimonials,
  getAllTestimonials,
  getApprovedTestimonials,
  approveTestimonial,
  rejectTestimonial,
  toggleFeatured,
  deleteTestimonial,
  getTestimonialStats,
} from "../controllers/testimonialController.js";
import { requireAuth } from "../middleware/requireAuth.js";
import isStudent from "../middleware/isStudent.js";
import { isAdmin } from "../middleware/isAdmin.js";

const router = express.Router();

// Student routes (protected)
router.post("/submit", requireAuth, isStudent, submitTestimonial);
router.get("/student", requireAuth, isStudent, getStudentTestimonials);

// Public route for website
router.get("/approved", getApprovedTestimonials);

// Admin routes (protected)
router.get("/", requireAuth, isAdmin, getAllTestimonials);
router.get("/stats", requireAuth, isAdmin, getTestimonialStats);
router.patch("/approve/:id", requireAuth, isAdmin, approveTestimonial);
router.patch("/reject/:id", requireAuth, isAdmin, rejectTestimonial);
router.patch("/toggle-featured/:id", requireAuth, isAdmin, toggleFeatured);
router.delete("/:id", requireAuth, isAdmin, deleteTestimonial);

export default router;