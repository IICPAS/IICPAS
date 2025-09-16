import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import Testimonials from "../models/Testimonials.js";

const router = express.Router();

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "uploads/testimonials";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "testimonial-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"), false);
    }
  },
});

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
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { name, designation, message } = req.body;
    const imagePath = req.file ? req.file.path : "";
    
    const newTestimonial = new Testimonials({
      name,
      designation,
      message,
      image: imagePath,
    });
    
    await newTestimonial.save();
    res.status(201).json({ message: "Testimonial created", data: newTestimonial });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT update
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { name, designation, message } = req.body;
    const updateData = { name, designation, message };
    
    // If new image is uploaded, add it to update data
    if (req.file) {
      // Delete old image if exists
      const existingTestimonial = await Testimonials.findById(req.params.id);
      if (existingTestimonial && existingTestimonial.image) {
        try {
          fs.unlinkSync(existingTestimonial.image);
        } catch (err) {
          console.log("Error deleting old image:", err);
        }
      }
      updateData.image = req.file.path;
    }
    
    const updatedTestimonial = await Testimonials.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    
    res.json({ message: "Testimonial updated", data: updatedTestimonial });
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
