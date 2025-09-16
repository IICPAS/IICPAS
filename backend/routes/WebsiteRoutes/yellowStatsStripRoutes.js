import express from "express";
import YellowStatsStrip from "../../models/Website/YellowStatsStrip.js";
import { requireAuth } from "../../middleware/requireAuth.js";
import { isAdmin } from "../../middleware/isAdmin.js";

const router = express.Router();

// Get current YellowStatsStrip content (public endpoint)
router.get("/", async (req, res) => {
  try {
    const yellowStatsStrip = await YellowStatsStrip.findOne({ isActive: true }).sort({ createdAt: -1 });
    if (!yellowStatsStrip) {
      // Return default content if no content found
      return res.json({
        title: "Our Achievements",
        statistics: [
          {
            icon: "FaGraduationCap",
            number: "120K+",
            label: "Successfully Student",
            color: "from-blue-500 to-cyan-500",
            bgColor: "from-blue-600/20 to-cyan-600/20"
          },
          {
            icon: "FaClipboardCheck",
            number: "560K+",
            label: "Courses Completed",
            color: "from-green-500 to-emerald-500",
            bgColor: "from-green-600/20 to-emerald-600/20"
          },
          {
            icon: "FaBookOpen",
            number: "3M+",
            label: "Satisfied Review",
            color: "from-purple-500 to-pink-500",
            bgColor: "from-purple-600/20 to-pink-600/20"
          },
          {
            icon: "FaTrophy",
            number: "120K+",
            label: "Successfully Student",
            color: "from-orange-500 to-red-500",
            bgColor: "from-orange-600/20 to-red-600/20"
          }
        ],
        colors: {
          title: "text-white",
          accent: "text-[#3cd664]",
          background: "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
        }
      });
    }
    res.json(yellowStatsStrip);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all YellowStatsStrip entries (admin only)
router.get("/all", requireAuth, isAdmin, async (req, res) => {
  try {
    const yellowStatsStrips = await YellowStatsStrip.find().sort({ createdAt: -1 });
    res.json(yellowStatsStrips);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create new YellowStatsStrip content (admin only)
router.post("/", requireAuth, isAdmin, async (req, res) => {
  try {
    // Deactivate all existing entries
    await YellowStatsStrip.updateMany({}, { isActive: false });
    
    // Create new entry
    const yellowStatsStrip = await YellowStatsStrip.create(req.body);
    res.status(201).json(yellowStatsStrip);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update YellowStatsStrip content (admin only)
router.put("/:id", requireAuth, isAdmin, async (req, res) => {
  try {
    const yellowStatsStrip = await YellowStatsStrip.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!yellowStatsStrip) {
      return res.status(404).json({ error: "YellowStatsStrip content not found" });
    }
    
    res.json(yellowStatsStrip);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Activate YellowStatsStrip content (admin only)
router.put("/activate/:id", requireAuth, isAdmin, async (req, res) => {
  try {
    // Deactivate all entries first
    await YellowStatsStrip.updateMany({}, { isActive: false });
    
    // Activate the selected entry
    const yellowStatsStrip = await YellowStatsStrip.findByIdAndUpdate(
      req.params.id,
      { isActive: true },
      { new: true }
    );
    
    if (!yellowStatsStrip) {
      return res.status(404).json({ error: "YellowStatsStrip content not found" });
    }
    
    res.json(yellowStatsStrip);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete YellowStatsStrip content (admin only)
router.delete("/:id", requireAuth, isAdmin, async (req, res) => {
  try {
    const yellowStatsStrip = await YellowStatsStrip.findByIdAndDelete(req.params.id);
    
    if (!yellowStatsStrip) {
      return res.status(404).json({ error: "YellowStatsStrip content not found" });
    }
    
    res.json({ message: "YellowStatsStrip content deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
