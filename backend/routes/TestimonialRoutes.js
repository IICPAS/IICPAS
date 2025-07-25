import express from "express";
import Testimonials from "../models/Testimonials.js";
const router = express.Router();

// GET all
router.get("/", async (req, res) => {
  try {
    const data = await Testimonials.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create
router.post("/", async (req, res) => {
  try {
    const newTestimonial = new Testimonials(req.body);
    await newTestimonial.save();
    res.status(201).json({ message: "Testimonial created" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT update
router.put("/:id", async (req, res) => {
  try {
    await Testimonials.findByIdAndUpdate(req.params.id, req.body);
    res.json({ message: "Testimonial updated" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PATCH status toggle
router.patch("/:id", async (req, res) => {
  try {
    await Testimonials.findByIdAndUpdate(req.params.id, {
      status: req.body.status,
    });
    res.json({ message: "Status updated" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  try {
    await Testimonials.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
