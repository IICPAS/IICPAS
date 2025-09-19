import express from "express";
import About from "../../models/Website/About.js";
import { requireAuth } from "../../middleware/requireAuth.js";
import { isAdmin } from "../../middleware/isAdmin.js";

const router = express.Router();

// Get current About content (public endpoint)
router.get("/", async (req, res) => {
  try {
    const about = await About.findOne({ isActive: true }).sort({
      createdAt: -1,
    });
    if (!about) {
      // Return default content if no content found
      return res.json({
        title: "About Us",
        content:
          "Welcome to IICPA Institute, where excellence in education meets innovation in learning.",
        mainImage: "/images/about.jpeg",
        testimonialImage: "/images/young-woman.jpg",
        video: {
          type: "file",
          url: "/videos/aboutus.mp4",
          poster: "/images/video-poster.jpg",
          autoplay: true,
          loop: true,
          muted: true,
        },
        testimonial: {
          text: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.",
          author: "Alisa Oliva",
          position: "Web Designer",
        },
        classSchedule: {
          title: "Our Class Day",
          days: [
            { day: "Saturday", time: "10:00-16:00" },
            { day: "Sunday", time: "10:00-16:00" },
            { day: "Monday", time: "10:00-16:00" },
            { day: "Tuesday", time: "10:00-16:00" },
            { day: "Wednesday", time: "10:00-16:00" },
          ],
        },
        button: {
          text: "Learn More About Us",
          link: "/about",
        },
        colors: {
          title: "text-green-600",
          content: "text-gray-700",
          background: "bg-white",
        },
      });
    }
    res.json(about);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all About entries (admin only)
router.get("/all", requireAuth, isAdmin, async (req, res) => {
  try {
    const abouts = await About.find().sort({ createdAt: -1 });
    res.json(abouts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create new About content (admin only)
router.post("/", requireAuth, isAdmin, async (req, res) => {
  try {
    // Deactivate all existing entries
    await About.updateMany({}, { isActive: false });

    // Create new entry
    const about = await About.create(req.body);
    res.status(201).json(about);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update About content (admin only)
router.put("/:id", requireAuth, isAdmin, async (req, res) => {
  try {
    const about = await About.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!about) {
      return res.status(404).json({ error: "About content not found" });
    }

    res.json(about);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Activate About content (admin only)
router.put("/activate/:id", requireAuth, isAdmin, async (req, res) => {
  try {
    // Deactivate all entries first
    await About.updateMany({}, { isActive: false });

    // Activate the selected entry
    const about = await About.findByIdAndUpdate(
      req.params.id,
      { isActive: true },
      { new: true }
    );

    if (!about) {
      return res.status(404).json({ error: "About content not found" });
    }

    res.json(about);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete About content (admin only)
router.delete("/:id", requireAuth, isAdmin, async (req, res) => {
  try {
    const about = await About.findByIdAndDelete(req.params.id);

    if (!about) {
      return res.status(404).json({ error: "About content not found" });
    }

    res.json({ message: "About content deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
