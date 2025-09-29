// Course Levels API Routes
import express from "express";
const router = express.Router();

// Default course levels
const DEFAULT_LEVELS = [
  { value: "Beginner", label: "Beginner" },
  { value: "Intermediate", label: "Intermediate" },
  { value: "Advanced", label: "Advanced" },
  { value: "Expert", label: "Expert" },
  { value: "Executive Level", label: "Executive Level" },
  { value: "Professional Level", label: "Professional Level" },
  { value: "Digital Hub+Center", label: "Digital Hub+Center" }
];

// GET /api/course-levels - Get all course levels
router.get("/", (req, res) => {
  try {
    res.json(DEFAULT_LEVELS);
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch course levels",
      error: error.message 
    });
  }
});

// POST /api/course-levels - Update course levels (for admin)
router.post("/", (req, res) => {
  try {
    const { levels } = req.body;
    
    if (!levels || !Array.isArray(levels)) {
      return res.status(400).json({
        success: false,
        message: "Invalid levels data"
      });
    }

    // In a real application, you would save this to database
    // For now, we'll just return success
    res.json({
      success: true,
      message: "Course levels updated successfully",
      data: levels
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update course levels",
      error: error.message
    });
  }
});

export default router;
