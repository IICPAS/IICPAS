import express from "express";
import Chapter from "../../models/Content/Chapter.js";
import Topic from "../../models/Content/Topic.js";
import Course from "../../models/Content/Course.js";

const router = express.Router();

// Get chapters for a specific course
router.get("/course/:courseId", async (req, res) => {
  try {
    const { courseId } = req.params;
    
    const course = await Course.findById(courseId).populate({
      path: 'chapters',
      populate: {
        path: 'topics',
        model: 'Topic'
      }
    });

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.json({
      success: true,
      chapters: course.chapters
    });
  } catch (error) {
    console.error("Error fetching chapters:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get topics for a specific chapter
router.get("/:chapterId/topics", async (req, res) => {
  try {
    const { chapterId } = req.params;
    
    const chapter = await Chapter.findById(chapterId).populate('topics');
    
    if (!chapter) {
      return res.status(404).json({ message: "Chapter not found" });
    }

    res.json({
      success: true,
      topics: chapter.topics
    });
  } catch (error) {
    console.error("Error fetching topics:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get specific topic content
router.get("/topics/:topicId", async (req, res) => {
  try {
    const { topicId } = req.params;
    
    const topic = await Topic.findById(topicId);
    
    if (!topic) {
      return res.status(404).json({ message: "Topic not found" });
    }

    res.json({
      success: true,
      topic: topic
    });
  } catch (error) {
    console.error("Error fetching topic:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
