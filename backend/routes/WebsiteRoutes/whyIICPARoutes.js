import express from "express";
import WhyIICPA from "../../models/Website/WhyIICPA.js";
import { requireAuth } from "../../middleware/requireAuth.js";
import { isAdmin } from "../../middleware/isAdmin.js";

const router = express.Router();

// Get current WhyIICPA content (public endpoint)
router.get("/", async (req, res) => {
  try {
    const whyIICPA = await WhyIICPA.findOne({ isActive: true }).sort({ createdAt: -1 });
    if (!whyIICPA) {
      // Return default content if no content found
      return res.json({
        title: "Empowering Your Future with Excellence",
        subtitle: "Why Choose IICPA",
        description: "IICPA Institute stands as a beacon of educational excellence, offering cutting-edge courses designed to transform your career aspirations into reality. Our comprehensive curriculum, expert instructors, and industry-aligned programs ensure you receive world-class education that prepares you for the dynamic professional landscape.",
        image: "/images/img1.jpg",
        statistics: {
          courses: {
            number: "50+",
            label: "Courses",
            description: "Comprehensive courses covering accounting, finance, and professional development"
          },
          students: {
            number: "10K+",
            label: "Students", 
            description: "Successful graduates building successful careers across industries"
          },
          successRate: {
            number: "98%",
            label: "Success Rate"
          }
        },
        features: [
          "Industry-Expert Instructors",
          "Flexible Learning Schedule",
          "Practical Hands-on Training", 
          "Career Placement Support"
        ],
        buttons: {
          exploreCourses: {
            text: "Explore Our Courses",
            link: "/courses"
          },
          learnMore: {
            text: "Learn More About IICPA",
            link: "/about"
          }
        },
        colors: {
          title: "text-white",
          subtitle: "text-green-400",
          description: "text-white/70",
          background: "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
        }
      });
    }
    res.json(whyIICPA);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all WhyIICPA entries (admin only)
router.get("/all", requireAuth, isAdmin, async (req, res) => {
  try {
    const whyIICPAEntries = await WhyIICPA.find().sort({ createdAt: -1 });
    res.json(whyIICPAEntries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create new WhyIICPA content (admin only)
router.post("/", requireAuth, isAdmin, async (req, res) => {
  try {
    // Deactivate all existing entries
    await WhyIICPA.updateMany({}, { isActive: false });
    
    // Create new entry
    const whyIICPA = await WhyIICPA.create(req.body);
    res.status(201).json(whyIICPA);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update WhyIICPA content (admin only)
router.put("/:id", requireAuth, isAdmin, async (req, res) => {
  try {
    const whyIICPA = await WhyIICPA.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!whyIICPA) {
      return res.status(404).json({ error: "WhyIICPA content not found" });
    }
    
    res.json(whyIICPA);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Activate WhyIICPA content (admin only)
router.put("/activate/:id", requireAuth, isAdmin, async (req, res) => {
  try {
    // Deactivate all entries first
    await WhyIICPA.updateMany({}, { isActive: false });
    
    // Activate the selected entry
    const whyIICPA = await WhyIICPA.findByIdAndUpdate(
      req.params.id,
      { isActive: true },
      { new: true }
    );
    
    if (!whyIICPA) {
      return res.status(404).json({ error: "WhyIICPA content not found" });
    }
    
    res.json(whyIICPA);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete WhyIICPA content (admin only)
router.delete("/:id", requireAuth, isAdmin, async (req, res) => {
  try {
    const whyIICPA = await WhyIICPA.findByIdAndDelete(req.params.id);
    
    if (!whyIICPA) {
      return res.status(404).json({ error: "WhyIICPA content not found" });
    }
    
    res.json({ message: "WhyIICPA content deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
