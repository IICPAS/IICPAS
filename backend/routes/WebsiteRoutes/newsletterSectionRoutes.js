import express from "express";
import NewsletterSection from "../../models/Website/NewsletterSection.js";
import { requireAuth } from "../../middleware/requireAuth.js";
import { isAdmin } from "../../middleware/isAdmin.js";

const router = express.Router();

// Get current NewsletterSection content (public endpoint)
router.get("/", async (req, res) => {
  try {
    const newsletterSection = await NewsletterSection.findOne({ isActive: true }).sort({ createdAt: -1 });
    if (!newsletterSection) {
      // Return default content if no content found
      return res.json({
        badge: {
          text: "Stay Updated",
          icon: "FaEnvelope"
        },
        title: {
          part1: "Never Miss Our",
          part2: "Latest Updates"
        },
        description: "Get exclusive access to new courses, special offers, and educational content delivered straight to your inbox. Join thousands of learners who stay ahead.",
        features: [
          { text: "Weekly Updates", icon: "FaCheckCircle" },
          { text: "Exclusive Content", icon: "FaCheckCircle" },
          { text: "No Spam", icon: "FaCheckCircle" }
        ],
        form: {
          placeholder: "Enter your email address",
          buttonText: "Subscribe",
          successText: "Done!",
          buttonIcon: "FaRocket",
          successIcon: "FaCheckCircle"
        },
        stats: {
          rating: "4.9/5 Rating",
          subscribers: "10,000+ Subscribers"
        },
        image: {
          src: "/images/student.png",
          alt: "Newsletter Student"
        },
        colors: {
          badge: "text-[#3cd664]",
          badgeBg: "bg-[#3cd664]/10",
          title: "text-gray-900",
          titleAccent: "from-[#3cd664] to-[#22c55e]",
          description: "text-gray-600",
          background: "bg-gradient-to-br from-[#f8fffe] via-[#f0fdf4] to-[#ecfdf5]",
          button: "from-[#3cd664] to-[#22c55e]",
          buttonHover: "from-[#22c55e] to-[#16a34a]"
        }
      });
    }
    res.json(newsletterSection);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all NewsletterSection entries (admin only)
router.get("/all", requireAuth, isAdmin, async (req, res) => {
  try {
    const newsletterSections = await NewsletterSection.find().sort({ createdAt: -1 });
    res.json(newsletterSections);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create new NewsletterSection content (admin only)
router.post("/", requireAuth, isAdmin, async (req, res) => {
  try {
    // Deactivate all existing entries
    await NewsletterSection.updateMany({}, { isActive: false });
    
    // Create new entry
    const newsletterSection = await NewsletterSection.create(req.body);
    res.status(201).json(newsletterSection);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update NewsletterSection content (admin only)
router.put("/:id", requireAuth, isAdmin, async (req, res) => {
  try {
    const newsletterSection = await NewsletterSection.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!newsletterSection) {
      return res.status(404).json({ error: "NewsletterSection content not found" });
    }
    
    res.json(newsletterSection);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Activate NewsletterSection content (admin only)
router.put("/activate/:id", requireAuth, isAdmin, async (req, res) => {
  try {
    // Deactivate all entries first
    await NewsletterSection.updateMany({}, { isActive: false });
    
    // Activate the selected entry
    const newsletterSection = await NewsletterSection.findByIdAndUpdate(
      req.params.id,
      { isActive: true },
      { new: true }
    );
    
    if (!newsletterSection) {
      return res.status(404).json({ error: "NewsletterSection content not found" });
    }
    
    res.json(newsletterSection);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete NewsletterSection content (admin only)
router.delete("/:id", requireAuth, isAdmin, async (req, res) => {
  try {
    const newsletterSection = await NewsletterSection.findByIdAndDelete(req.params.id);
    
    if (!newsletterSection) {
      return res.status(404).json({ error: "NewsletterSection content not found" });
    }
    
    res.json({ message: "NewsletterSection content deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
