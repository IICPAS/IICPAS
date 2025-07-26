import express from "express";
import {
  applyToJob,
  getAllApplications,
  getApplicationById,
  updateApplication,
  deleteApplication,
} from "../controllers/jobApplicationController.js";

const router = express.Router();

router.post("/", applyToJob); // Create application
router.get("/", getAllApplications); // View all applications
router.get("/:id", getApplicationById); // Get application by ID
router.put("/:id", updateApplication); // Update application by ID
router.delete("/:id", deleteApplication); // Delete application by ID

export default router;
