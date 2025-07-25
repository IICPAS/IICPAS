import express from "express";
import Metatag from "../models/MetaTags.js";

const router = express.Router();

// GET all metatags
router.get("/", async (req, res) => {
  try {
    const data = await Metatag.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST new metatag
router.post("/", async (req, res) => {
  try {
    const newMeta = new Metatag(req.body);
    await newMeta.save();
    res.status(201).json({ message: "Metatag created" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT update metatag
router.put("/:id", async (req, res) => {
  try {
    await Metatag.findByIdAndUpdate(req.params.id, req.body);
    res.json({ message: "Metatag updated" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE metatag
router.delete("/:id", async (req, res) => {
  try {
    await Metatag.findByIdAndDelete(req.params.id);
    res.json({ message: "Metatag deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
