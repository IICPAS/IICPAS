import express from "express";
import multer from "multer";
import {
  createBlog,
  getBlogs,
  getBlog,
  updateBlog,
  deleteBlog,
  toggleBlogStatus, // Add this controller!
} from "../controllers/blogControllers.js";

const router = express.Router();

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "_"));
  },
});
const upload = multer({ storage });

// CRUD routes
router.post("/", upload.single("image"), createBlog);
router.get("/", getBlogs);
router.get("/:id", getBlog);
router.put("/:id", upload.single("image"), updateBlog);
router.delete("/:id", deleteBlog);

// Toggle status route
router.patch("/:id/toggle-status", toggleBlogStatus);

export default router;
