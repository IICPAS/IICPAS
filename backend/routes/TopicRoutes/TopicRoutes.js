import express from "express";
import {
  getAllTopics,
  getTopicById,
  createTopic,
  updateTopic,
  deleteTopic,
  toggleTopicStatus,
} from "../../controllers/Topics/TopicControllers.js";

const router = express.Router();

router.get("/", getAllTopics);
router.get("/:id", getTopicById);
router.post("/", createTopic);
router.put("/:id", updateTopic);
router.put("/:id/toggle-status", toggleTopicStatus);
router.delete("/:id", deleteTopic);

export default router;
