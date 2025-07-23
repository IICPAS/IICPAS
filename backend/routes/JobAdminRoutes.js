import JobAdmin from "../models/JobAdmin.js";
import express from "express";

const router = express.Router();
router.post("/jobs", async (req, res) => {
  try {
    const job = await JobAdmin.create(req.body);
    res.status(201).json(job);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/jobs", async (req, res) => {
  try {
    const jobs = await JobAdmin.find();
    res.status(200).json(jobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @route   GET /jobs/:id
// @desc    Get single job
router.get("/jobs/:id", async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.status(200).json(job);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// @route   PUT /jobs/:id
// @desc    Update job
router.put("/jobs/:id", async (req, res) => {
  try {
    const job = await JobAdmin.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json(job);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// @route   DELETE /jobs/:id
// @desc    Delete job
router.delete("/jobs/:id", async (req, res) => {
  try {
    await Job.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
