import express from "express";
import * as caseStudyController from "../controllers/caseStudyController.js";

const router = express.Router();

// Create new case study
router.post("/", caseStudyController.createCaseStudy);

// Get all case studies for a chapter
router.get("/chapter/:chapterId", caseStudyController.getCaseStudiesByChapter);

// Get single case study
router.get("/:id", caseStudyController.getCaseStudy);

// Update case study
router.put("/:id", caseStudyController.updateCaseStudy);

// Delete case study
router.delete("/:id", caseStudyController.deleteCaseStudy);

// Add task to case study
router.post("/:id/tasks", caseStudyController.addTask);

// Add content to case study
router.post("/:id/content", caseStudyController.addContent);

// Add simulation to case study
router.post("/:id/simulations", caseStudyController.addSimulation);

// Add question set to case study
router.post("/:id/question-sets", caseStudyController.addQuestionSet);

export default router;
