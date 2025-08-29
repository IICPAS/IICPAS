import express from "express";
import {
  getAllRevisionTests,
  getRevisionTestsByCourse,
  getRevisionTest,
  createRevisionTest,
  updateRevisionTest,
  deleteRevisionTest,
  toggleRevisionTestStatus,
  getAvailableCourses,
} from "../../controllers/content/revisionTestController.js";

const router = express.Router();

// Get all revision tests
router.get("/", getAllRevisionTests);

// Get available courses for revision tests
router.get("/courses", getAvailableCourses);

// Get revision tests by course
router.get("/course/:courseId", getRevisionTestsByCourse);

// Get single revision test
router.get("/:id", getRevisionTest);

// Create revision test
router.post("/", createRevisionTest);

// Update revision test
router.put("/:id", updateRevisionTest);

// Delete revision test
router.delete("/:id", deleteRevisionTest);

// Toggle revision test status
router.patch("/toggle/:id", toggleRevisionTestStatus);

export default router;
