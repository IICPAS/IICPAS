import { Router } from "express";
import * as chapterController from "../../controllers/content/chapterControllers.js";

const router = Router();

router.get("/by-course/:courseId", chapterController.getChaptersByCourse);
router.post("/by-course/:courseId", chapterController.createChapter);
router.get("/:id", chapterController.getChapter);
router.put("/:id", chapterController.updateChapter);
router.delete("/:id", chapterController.deleteChapter);

export default router;
