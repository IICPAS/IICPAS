const express = require("express");
const router = express.Router();
const assignmentController = require("../controllers/assignmentController");

// Create new assignment
router.post("/", assignmentController.createAssignment);

// Get all assignments for a chapter
router.get("/chapter/:chapterId", assignmentController.getAssignmentsByChapter);

// Get single assignment
router.get("/:id", assignmentController.getAssignment);

// Update assignment
router.put("/:id", assignmentController.updateAssignment);

// Delete assignment
router.delete("/:id", assignmentController.deleteAssignment);

// Add task to assignment
router.post("/:id/tasks", assignmentController.addTask);

// Add content to assignment
router.post("/:id/content", assignmentController.addContent);

// Add simulation to assignment
router.post("/:id/simulations", assignmentController.addSimulation);

// Add question set to assignment
router.post("/:id/question-sets", assignmentController.addQuestionSet);

module.exports = router;
