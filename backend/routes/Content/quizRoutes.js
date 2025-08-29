import { Router } from "express";
import * as quizController from "../../controllers/content/quizControllers.js";
import upload from "./utils/multer.js"; // Adjust if multer file is elsewhere

const router = Router();

// Quiz CRUD
router.post("/", quizController.createQuiz);
router.get("/:id", quizController.getQuiz);
router.put("/:id", quizController.updateQuiz);
router.delete("/:id", quizController.deleteQuiz);

// Get quiz by topic ID
router.get("/topic/:topicId", quizController.getQuizByTopic);

// Get quiz preview for admin
router.get("/preview/:topicId", quizController.getQuizPreview);

// Create or update quiz for a topic
router.post("/topic/:topicId", quizController.createOrUpdateQuizForTopic);

// Get 5 random questions for a topic
router.get("/random", quizController.getRandomQuizQuestions);

// Image upload for quiz questions
router.post("/upload-image", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No image uploaded" });
  }
  res.json({ imageUrl: req.file.path });
});

export default router;
