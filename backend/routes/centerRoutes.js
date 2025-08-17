import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Center } from "../models/Center.js";
import multer from "multer";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

const router = express.Router();

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/center_docs/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// Create JWT token
const createToken = (id) => {
  return jwt.sign({ id }, process.env.SECRET, {
    expiresIn: "7d",
  });
};

// Register Center
router.post("/register", upload.single("document"), async (req, res) => {
  const { name, phone, email, password, location, address, type } = req.body;

  try {
    const existing = await Center.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const center = new Center({
      name,
      phone,
      email,
      password: hashed,
      location,
      address,
      type,
      document: req.file ? `/uploads/center_docs/${req.file.filename}` : "",
    });

    await center.save();

    res.status(201).json({
      message: "Center registered successfully. Awaiting approval.",
      center: {
        id: center._id,
        name: center.name,
        email: center.email,
        status: center.status,
      },
    });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Registration failed", details: err.message });
  }
});

// Login Center
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const center = await Center.findOne({ email });
    if (!center) {
      return res.status(400).json({ message: "Center not found" });
    }

    if (center.status !== "approved") {
      return res.status(400).json({
        message:
          "Your account is pending approval. Please wait for admin approval.",
      });
    }

    const valid = await bcrypt.compare(password, center.password);
    if (!valid) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = createToken(center._id);
    res.cookie("centerToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({
      message: "Login successful",
      center: {
        id: center._id,
        name: center.name,
        email: center.email,
        status: center.status,
      },
    });
  } catch (err) {
    res.status(500).json({ error: "Login failed", details: err.message });
  }
});

// Check if center is logged in
router.get("/iscenter", async (req, res) => {
  const token = req.cookies.centerToken;

  if (!token) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET);
    const center = await Center.findById(decoded.id).select("-password");

    if (!center) {
      return res.status(401).json({ message: "Center not found" });
    }

    res.json({ center });
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
});

// Logout
router.get("/logout", (req, res) => {
  res.cookie("centerToken", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.json({ message: "Logged out successfully" });
});

// Get center profile
router.get("/profile/:id", async (req, res) => {
  try {
    const center = await Center.findById(req.params.id).select("-password");
    if (!center) {
      return res.status(404).json({ message: "Center not found" });
    }
    res.json({ center });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to fetch profile", details: err.message });
  }
});

// Update center profile
router.patch("/profile/:id", upload.single("image"), async (req, res) => {
  const { phone, location, address, type } = req.body;

  try {
    const center = await Center.findById(req.params.id);
    if (!center) {
      return res.status(404).json({ message: "Center not found" });
    }

    if (phone) center.phone = phone;
    if (location) center.location = location;
    if (address) center.address = address;
    if (type) center.type = type;
    if (req.file) {
      center.image = `/uploads/center_docs/${req.file.filename}`;
    }

    await center.save();
    res.json({ message: "Profile updated successfully", center });
  } catch (err) {
    res.status(500).json({ error: "Update failed", details: err.message });
  }
});

// Admin: Get all centers
router.get("/admin/all", async (req, res) => {
  try {
    const centers = await Center.find({}).select("-password");
    res.json({ centers });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to fetch centers", details: err.message });
  }
});

// Admin: Approve center
router.patch("/admin/approve/:id", async (req, res) => {
  try {
    const center = await Center.findByIdAndUpdate(
      req.params.id,
      { status: "approved" },
      { new: true }
    ).select("-password");

    if (!center) {
      return res.status(404).json({ message: "Center not found" });
    }

    res.json({ message: "Center approved successfully", center });
  } catch (err) {
    res.status(500).json({ error: "Approval failed", details: err.message });
  }
});

export default router;
