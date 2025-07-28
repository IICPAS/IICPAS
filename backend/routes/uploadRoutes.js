import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();

// Ensure video directory exists
const dir = "uploads/videos";
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

// Configure Multer storage
const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, dir),
  filename: (_, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

// Export upload middleware
export const uploadVideo = multer({ storage });

const upload = multer({ storage });

router.post("/video", upload.single("video"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });
  const videoUrl = `${req.protocol}://${req.get("host")}/uploads/videos/${
    req.file.filename
  }`;
  res.json({ videoUrl });
});

export default router;
