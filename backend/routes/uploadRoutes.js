import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();

// Ensure directories exist
const videoDir = "uploads/videos";
const imageDir = "uploads/images";
if (!fs.existsSync(videoDir)) {
  fs.mkdirSync(videoDir, { recursive: true });
}
if (!fs.existsSync(imageDir)) {
  fs.mkdirSync(imageDir, { recursive: true });
}

// Configure Multer storage for videos
const videoStorage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, videoDir),
  filename: (_, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

// Video upload middleware with validation
export const uploadVideo = multer({
  storage: videoStorage,
  fileFilter: (req, file, cb) => {
    // Accept only video files
    if (file.mimetype.startsWith("video/")) {
      cb(null, true);
    } else {
      cb(new Error("Only video files are allowed!"), false);
    }
  },
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit for videos
  },
});

// Configure Multer storage for images
const imageStorage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, imageDir),
  filename: (_, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

export const uploadImage = multer({
  storage: imageStorage,
  fileFilter: (req, file, cb) => {
    // Accept only image files
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"), false);
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

const upload = multer({ storage: videoStorage });

// Video upload route
router.post("/video", uploadVideo.single("video"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  // Use API_URL from environment if available, otherwise use request host
  const baseUrl = process.env.API_URL || `${req.protocol}://${req.get("host")}`;
  const videoUrl = `${baseUrl}/uploads/videos/${req.file.filename}`;

  res.json({ videoUrl });
});

// Image upload route
router.post("/image", uploadImage.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  // Use API_URL from environment if available, otherwise use request host
  const baseUrl = process.env.API_URL || `${req.protocol}://${req.get("host")}`;
  const imageUrl = `${baseUrl}/uploads/images/${req.file.filename}`;

  res.json({ imageUrl });
});

export default router;
