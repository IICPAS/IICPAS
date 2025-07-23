import express from "express";
import upload from "../middleware/upload1.js";
import {
  createCourse,
  getCourses,
  deleteCourse,
} from "../controllers/CourseControllers.js";

const router = express.Router();

router.post("/", upload.single("previewImage"), createCourse);
router.get("/", getCourses);
router.delete("/:id", deleteCourse);

export default router;
