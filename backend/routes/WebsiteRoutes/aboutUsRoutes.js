import express from "express";
import AboutUs from "../../models/Website/AboutUs.js";
import { requireAuth } from "../../middleware/requireAuth.js";
import { isAdmin } from "../../middleware/isAdmin.js";

const router = express.Router();

// Get current About Us content (public endpoint)
router.get("/", async (req, res) => {
  try {
    const aboutUs = await AboutUs.findOne({ isActive: true }).sort({ createdAt: -1 });
    if (!aboutUs) {
      // Return default content if no content found
      return res.json({
        hero: {
          title: "About Us",
          breadcrumb: "Home // About Us"
        },
        mainContent: {
          badge: "📘 About Us",
          title: "Behind The Scenes: Discover The People & Passion",
          description: "Meet the talented individuals who bring our vision to life every day. With a shared passion and commitment, our team works tirelessly to deliver exceptional quality and innovation."
        },
        images: {
          mainImage: {
            url: "/images/girl-yellow.jpg",
            alt: "Student 1"
          },
          secondaryImage: {
            url: "/images/boy-color.jpg",
            alt: "Student 2"
          }
        },
        experienceBadge: {
          icon: "💡",
          years: "25+",
          text: "Years of experience"
        },
        mission: {
          title: "It provides tools for course creation",
          description: "Enrollment management, and tracking learner progress, ensuring a streamlined learning experience."
        },
        vision: {
          title: "Our vision is to reshape education globally",
          description: "Empowering students with quality learning through personalized technology-driven platforms."
        },
        colors: {
          primary: "text-green-600",
          secondary: "text-gray-600",
          accent: "bg-green-600"
        }
      });
    }
    res.json(aboutUs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all About Us entries (admin only)
router.get("/all", requireAuth, isAdmin, async (req, res) => {
  try {
    const aboutUsEntries = await AboutUs.find().sort({ createdAt: -1 });
    res.json(aboutUsEntries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create new About Us content (admin only)
router.post("/", requireAuth, isAdmin, async (req, res) => {
  try {
    // Deactivate all existing entries
    await AboutUs.updateMany({}, { isActive: false });
    
    // Create new entry
    const aboutUs = await AboutUs.create(req.body);
    res.status(201).json(aboutUs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update About Us content (admin only)
router.put("/:id", requireAuth, isAdmin, async (req, res) => {
  try {
    const aboutUs = await AboutUs.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!aboutUs) {
      return res.status(404).json({ error: "About Us content not found" });
    }
    
    res.json(aboutUs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Activate About Us content (admin only)
router.put("/activate/:id", requireAuth, isAdmin, async (req, res) => {
  try {
    // Deactivate all entries first
    await AboutUs.updateMany({}, { isActive: false });
    
    // Activate the selected entry
    const aboutUs = await AboutUs.findByIdAndUpdate(
      req.params.id,
      { isActive: true },
      { new: true }
    );
    
    if (!aboutUs) {
      return res.status(404).json({ error: "About Us content not found" });
    }
    
    res.json(aboutUs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete About Us content (admin only)
router.delete("/:id", requireAuth, isAdmin, async (req, res) => {
  try {
    const aboutUs = await AboutUs.findByIdAndDelete(req.params.id);
    
    if (!aboutUs) {
      return res.status(404).json({ error: "About Us content not found" });
    }
    
    res.json({ message: "About Us content deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
