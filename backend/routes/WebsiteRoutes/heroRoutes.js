import express from "express";
import Hero from "../../models/Website/Hero.js";
import { requireAuth } from "../../middleware/requireAuth.js";
import { isAdmin } from "../../middleware/isAdmin.js";
import { uploadVideo } from "../../middleware/videoUpload.js";

const router = express.Router();

// Get current hero content (public endpoint)
router.get("/", async (req, res) => {
  try {
    const hero = await Hero.findOne({ isActive: true }).sort({ createdAt: -1 });
    if (!hero) {
      // Return default content if no hero found
      return res.json({
        smallText: "# Best Online Platform",
        mainHeading: {
          part1: "Start Learning",
          part2: "Today",
          part3: "Discover",
          part4: "Your Next",
          part5: "Great Skill"
        },
        description: "Enhance your educational journey with our cutting-edge course platform.",
        buttonText: "Get Started »",
        videoUrl: "/videos/homehero.mp4",
        colors: {
          smallText: "text-green-400",
          part1: "text-white",
          part2: "text-green-400",
          part3: "text-green-400",
          part4: "text-white",
          part5: "text-blue-300",
          description: "text-white/90",
          button: "bg-green-500 hover:bg-green-600"
        }
      });
    }
    res.json(hero);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all hero entries (admin only)
router.get("/all", requireAuth, isAdmin, async (req, res) => {
  try {
    const heroes = await Hero.find().sort({ createdAt: -1 });
    res.json(heroes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Upload video for hero section (admin only)
router.post("/upload-video", requireAuth, isAdmin, uploadVideo, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No video file uploaded" });
    }

    const videoPath = `/uploads/videos/${req.file.filename}`;
    res.json({ 
      message: "Video uploaded successfully", 
      videoPath: videoPath,
      filename: req.file.filename 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create new hero content (admin only)
router.post("/", requireAuth, isAdmin, async (req, res) => {
  try {
    // Deactivate all existing heroes
    await Hero.updateMany({}, { isActive: false });
    
    // Create new hero
    const hero = await Hero.create(req.body);
    res.status(201).json(hero);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update hero content (admin only)
router.put("/:id", requireAuth, isAdmin, async (req, res) => {
  try {
    const hero = await Hero.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!hero) {
      return res.status(404).json({ error: "Hero content not found" });
    }
    
    res.json(hero);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Activate hero content (admin only)
router.put("/activate/:id", requireAuth, isAdmin, async (req, res) => {
  try {
    // Deactivate all heroes first
    await Hero.updateMany({}, { isActive: false });
    
    // Activate the selected hero
    const hero = await Hero.findByIdAndUpdate(
      req.params.id,
      { isActive: true },
      { new: true }
    );
    
    if (!hero) {
      return res.status(404).json({ error: "Hero content not found" });
    }
    
    res.json(hero);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete hero content (admin only)
router.delete("/:id", requireAuth, isAdmin, async (req, res) => {
  try {
    const hero = await Hero.findByIdAndDelete(req.params.id);
    
    if (!hero) {
      return res.status(404).json({ error: "Hero content not found" });
    }
    
    res.json({ message: "Hero content deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
