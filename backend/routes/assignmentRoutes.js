import express from "express";
import * as assignmentController from "../controllers/assignmentController.js";

const router = express.Router();

// Create new assignment
router.post("/", assignmentController.createAssignment);

// Get all assignments
router.get("/", assignmentController.getAllAssignments);

// Get assignments by status (active/inactive)
router.get("/status/:status", assignmentController.getAssignmentsByStatus);

// Get assignments with advanced filtering
router.get("/filter", assignmentController.getAssignmentsWithFilter);

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

export default router;
