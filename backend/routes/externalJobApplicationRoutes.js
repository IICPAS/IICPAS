import express from "express";
import {
  applyToExternalJob,
  getAllExternalApplications,
  getApplicationsByCompany,
  updateApplicationStatus,
  deleteExternalApplication,
} from "../controllers/externalJobApplicationController.js";

const router = express.Router();

router.post("/", applyToExternalJob); // Create external job application
router.get("/", getAllExternalApplications); // Get all external applications
router.get("/company/:companyEmail", getApplicationsByCompany); // Get applications by company
router.put("/:id/status", updateApplicationStatus); // Update application status
router.delete("/:id", deleteExternalApplication); // Delete application

export default router;
