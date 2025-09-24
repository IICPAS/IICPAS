import { Router } from "express";
import * as courseController from "../../controllers/content/courseControllers.js";
import upload from "./utils/multer.js";
const router = Router();

router.get("/", courseController.getAllCourses);
router.get("/all", courseController.getAllCourses);
router.get("/available", courseController.getAvailableCourses);
router.get("/student-courses/:studentId", courseController.getStudentCourses);
router.post("/", upload.single("image"), courseController.createCourse);
router.put("/:id", upload.single("image"), courseController.updateCourse);
router.delete("/:id", courseController.deleteCourse);
router.get("/:id", courseController.getCourse);
router.put("/:id/toggle-status", courseController.toggleCourseStatus);

// Course Level Management Routes
router.get("/course-levels", courseController.getCourseLevels);

// Simulation Image Upload Route
router.post("/upload-simulation-image", upload.single("image"), courseController.uploadSimulationImage);

export default router;
