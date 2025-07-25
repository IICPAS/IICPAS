import express from "express";
import Job from "../models/Job.js";
import Application from "../models/Application.js";
import nodemailer from "nodemailer";

const router = express.Router();

// Create Job
router.post("/", async (req, res) => {
  try {
    const job = await Job.create(req.body);
    res.status(201).json(job);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get All Jobs
router.get("/", async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Single Job
router.get("/:id", async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    res.json(job);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Job
router.put("/:id", async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(job);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete Job
router.delete("/:id", async (req, res) => {
  try {
    await Job.findByIdAndDelete(req.params.id);
    res.json({ message: "Job deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Applications for a Job
router.get("/:id/applications", async (req, res) => {
  try {
    const applications = await Application.find({ jobId: req.params.id });
    res.json(applications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Shortlist Application
router.put("/applications/:id/shortlist", async (req, res) => {
  try {
    const app = await Application.findByIdAndUpdate(
      req.params.id,
      { shortlisted: true },
      { new: true }
    );
    res.json(app);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Send Shortlist Email
router.post("/applications/:id/send-email", async (req, res) => {
  try {
    const app = await Application.findById(req.params.id);
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "your@gmail.com",
        pass: "your_app_password",
      },
    });

    await transporter.sendMail({
      from: "your@gmail.com",
      to: app.email,
      subject: "Shortlisted for Job",
      html: `<p>Dear ${app.name},</p><p>Congratulations! You’ve been shortlisted.</p>`,
    });

    res.json({ message: "Email sent" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
