import express from "express";
import multer from "multer";
import path from "path";
import {
  submitTestimonial,
  createTestimonial,
  getStudentTestimonials,
  getAllTestimonials,
  getApprovedTestimonials,
  approveTestimonial,
  rejectTestimonial,
  toggleFeatured,
  deleteTestimonial,
  updateTestimonial,
  getTestimonialStats,
} from "../controllers/testimonialController.js";
import { requireAuth } from "../middleware/requireAuth.js";
import isStudent from "../middleware/isStudent.js";
import { isAdmin } from "../middleware/isAdmin.js";

// Configure multer for testimonial image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/testimonials/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "testimonial-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"), false);
    }
  },
});

const router = express.Router();

// Student routes (protected)
router.post("/submit", isStudent, upload.single("image"), submitTestimonial);
router.get("/student", isStudent, getStudentTestimonials);

// Public route for website
router.get("/approved", getApprovedTestimonials);

// Admin routes (protected)
router.get("/", requireAuth, isAdmin, getAllTestimonials);
router.post("/", requireAuth, isAdmin, upload.single("image"), createTestimonial);
router.get("/stats", requireAuth, isAdmin, getTestimonialStats);
router.patch("/approve/:id", requireAuth, isAdmin, approveTestimonial);
router.patch("/reject/:id", requireAuth, isAdmin, rejectTestimonial);
router.patch("/toggle-featured/:id", requireAuth, isAdmin, toggleFeatured);
router.put("/:id", requireAuth, isAdmin, upload.single("image"), updateTestimonial);
router.delete("/:id", requireAuth, isAdmin, deleteTestimonial);

export default router;
