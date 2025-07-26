import express from "express";
import {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
} from "../controllers/jobControllers.js";

const router = express.Router();

router.post("/", createJob); // Create job
router.get("/", getAllJobs); // View all jobs
router.get("/:id", getJobById); // Get job by ID
router.put("/:id", updateJob); // Update job by ID
router.delete("/:id", deleteJob); // Delete job by ID

export default router;
