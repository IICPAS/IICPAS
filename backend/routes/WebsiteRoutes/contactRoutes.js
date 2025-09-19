import express from "express";
import Contact from "../../models/Website/Contact.js";
import { requireAuth } from "../../middleware/requireAuth.js";
import { isAdmin } from "../../middleware/isAdmin.js";

const router = express.Router();

// Get current Contact content (public endpoint)
router.get("/", async (req, res) => {
  try {
    const contact = await Contact.findOne({ isActive: true }).sort({ createdAt: -1 });
    if (!contact) {
      // Return default content if no content found
      return res.json({
        title: "Contact Us",
        subtitle: "Let's Get in Touch",
        description: "Ready to start your learning journey? Get in touch with us today!",
        contactInfo: {
          phone: {
            number: "+91 98765 43210",
            label: "Phone"
          },
          email: {
            address: "support@iicpa.org",
            label: "Email"
          },
          address: {
            text: "123 Knowledge Park, New Delhi, India",
            label: "Address"
          }
        },
        form: {
          buttonText: "Send Message",
          successMessage: "Message sent successfully!",
          errorMessage: "Something went wrong. Please try again."
        },
        colors: {
          title: "text-green-600",
          subtitle: "text-gray-900",
          description: "text-gray-600",
          background: "bg-white"
        }
      });
    }
    res.json(contact);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all Contact entries (admin only)
router.get("/all", requireAuth, isAdmin, async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Submit contact form (public endpoint)
router.post("/submit", async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    
    // Basic validation
    if (!name || !email || !message) {
      return res.status(400).json({ error: "Name, email, and message are required" });
    }
    
    // Here you would typically save to a database or send an email
    // For now, we'll just log the submission
    console.log("Contact form submission:", { name, email, phone, message });
    
    res.status(200).json({ message: "Message sent successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create new Contact content (admin only)
router.post("/", requireAuth, isAdmin, async (req, res) => {
  try {
    // Deactivate all existing entries
    await Contact.updateMany({}, { isActive: false });
    
    // Create new entry
    const contact = await Contact.create(req.body);
    res.status(201).json(contact);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Contact content (admin only)
router.put("/:id", requireAuth, isAdmin, async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!contact) {
      return res.status(404).json({ error: "Contact content not found" });
    }
    
    res.json(contact);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Activate Contact content (admin only)
router.put("/activate/:id", requireAuth, isAdmin, async (req, res) => {
  try {
    // Deactivate all entries first
    await Contact.updateMany({}, { isActive: false });
    
    // Activate the selected entry
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { isActive: true },
      { new: true }
    );
    
    if (!contact) {
      return res.status(404).json({ error: "Contact content not found" });
    }
    
    res.json(contact);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete Contact content (admin only)
router.delete("/:id", requireAuth, isAdmin, async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    
    if (!contact) {
      return res.status(404).json({ error: "Contact content not found" });
    }
    
    res.json({ message: "Contact content deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
