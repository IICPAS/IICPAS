import express from "express";
import StudyMaterial from "../../models/Website/StudyMaterial.js";

const router = express.Router();

// GET - Get study material data
router.get("/", async (req, res) => {
  try {
    let studyMaterial = await StudyMaterial.findOne();
    
    if (!studyMaterial) {
      // Create default data if none exists
      studyMaterial = new StudyMaterial();
      await studyMaterial.save();
    }
    
    res.json(studyMaterial);
  } catch (error) {
    console.error("Error fetching study material:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// PUT - Update study material data
router.put("/", async (req, res) => {
  try {
    let studyMaterial = await StudyMaterial.findOne();
    
    if (!studyMaterial) {
      studyMaterial = new StudyMaterial();
    }
    
    // Update the data
    Object.assign(studyMaterial, req.body);
    await studyMaterial.save();
    
    res.json({ message: "Study material updated successfully", data: studyMaterial });
  } catch (error) {
    console.error("Error updating study material:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// POST - Create new study material data
router.post("/", async (req, res) => {
  try {
    const studyMaterial = new StudyMaterial(req.body);
    await studyMaterial.save();
    
    res.status(201).json({ message: "Study material created successfully", data: studyMaterial });
  } catch (error) {
    console.error("Error creating study material:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// DELETE - Delete study material data
router.delete("/", async (req, res) => {
  try {
    await StudyMaterial.deleteMany();
    res.json({ message: "Study material deleted successfully" });
  } catch (error) {
    console.error("Error deleting study material:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
