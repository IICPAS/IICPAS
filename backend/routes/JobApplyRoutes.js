import JobApplier from "../models/JobApplier.js";
import express from "express";

const router = express.Router();
// @route   POST /applications
// @desc    Submit a job application
router.post("/applications", async (req, res) => {
  try {
    const application = await JobApplier.create(req.body);
    res.status(201).json(application);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// @route   GET /applications
// @desc    Get all job applications
router.get("/applications", async (req, res) => {
  try {
    const applications = await JobApplier.find().populate("job");
    res.status(200).json(applications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @route   GET /applications/:id
// @desc    Get a single application by ID
router.get("/applications/:id", async (req, res) => {
  try {
    const application = await JobApplier.findById(req.params.id).populate(
      "job"
    );
    if (!application)
      return res.status(404).json({ message: "Application not found" });
    res.status(200).json(application);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// @route   PUT /applications/:id
// @desc    Update an application (e.g., shortlist or reject)
router.put("/applications/:id", async (req, res) => {
  try {
    const updatedApplication = await JobApplier.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedApplication);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// @route   DELETE /applications/:id
// @desc    Delete a job application
router.delete("/applications/:id", async (req, res) => {
  try {
    await JobApplier.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
