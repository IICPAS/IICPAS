import { Router } from "express";
import * as courseController from "../../controllers/content/courseControllers.js";
import upload from "./utils/multer.js";
const router = Router();

router.get("/", courseController.getAllCourses);
router.post("/", upload.single("image"), courseController.createCourse);
router.get("/:id", courseController.getCourse);
router.put("/:id", courseController.updateCourse);
router.delete("/:id", courseController.deleteCourse);

export default router;
