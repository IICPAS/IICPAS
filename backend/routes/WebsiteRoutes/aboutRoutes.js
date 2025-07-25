import express from "express";
import About from "../../models/Website/About.js";

const router = express.Router();

// Create About Content
router.post("/", async (req, res) => {
  try {
    const about = await About.create(req.body);
    res.status(201).json(about);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get All About Entries
router.get("/", async (req, res) => {
  try {
    const abouts = await About.find().sort({ createdAt: -1 });
    res.json(abouts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Single About Entry
router.get("/:id", async (req, res) => {
  try {
    const about = await About.findById(req.params.id);
    res.json(about);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update About Entry
router.put("/:id", async (req, res) => {
  try {
    const updated = await About.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete About Entry
router.delete("/:id", async (req, res) => {
  try {
    await About.findByIdAndDelete(req.params.id);
    res.json({ message: "About entry deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
