import express from "express";
import CareerGuidance from "../../models/Website/CareerGuidance.js";

const router = express.Router();

// GET - Get career guidance data
router.get("/", async (req, res) => {
  try {
    let careerGuidance = await CareerGuidance.findOne();
    
    if (!careerGuidance) {
      // Create default data if none exists
      careerGuidance = new CareerGuidance();
      await careerGuidance.save();
    }
    
    res.json(careerGuidance);
  } catch (error) {
    console.error("Error fetching career guidance:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// PUT - Update career guidance data
router.put("/", async (req, res) => {
  try {
    let careerGuidance = await CareerGuidance.findOne();
    
    if (!careerGuidance) {
      careerGuidance = new CareerGuidance();
    }
    
    // Update the data
    Object.assign(careerGuidance, req.body);
    await careerGuidance.save();
    
    res.json({ message: "Career guidance updated successfully", data: careerGuidance });
  } catch (error) {
    console.error("Error updating career guidance:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// POST - Create new career guidance data
router.post("/", async (req, res) => {
  try {
    const careerGuidance = new CareerGuidance(req.body);
    await careerGuidance.save();
    
    res.status(201).json({ message: "Career guidance created successfully", data: careerGuidance });
  } catch (error) {
    console.error("Error creating career guidance:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// DELETE - Delete career guidance data
router.delete("/", async (req, res) => {
  try {
    await CareerGuidance.deleteMany();
    res.json({ message: "Career guidance deleted successfully" });
  } catch (error) {
    console.error("Error deleting career guidance:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
