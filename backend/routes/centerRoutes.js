import express from "express";
import {
  getAllCenters,
  getCenterById,
  createCenter,
  updateCenter,
  deleteCenter,
  getPublicCenters,
  getAvailableCourses,
} from "../controllers/centerController.js";
import {
  registerCenter,
  loginCenter,
  logoutCenter,
  getCenterProfile,
} from "../controllers/centerAuthController.js";
import { isCenter } from "../middleware/isCenter.js";
import { uploadCenterDoc } from "../middleware/multerUpload.js";

const router = express.Router();

// Authentication routes
router.post("/register", uploadCenterDoc.single("document"), registerCenter);
router.post("/login", loginCenter);
router.post("/logout", logoutCenter);

// Public routes
router.get("/public", getPublicCenters);
router.get("/courses", getAvailableCourses);

// Protected center routes
router.get("/profile", isCenter, getCenterProfile);

// Admin routes (no authentication required)
router.get("/", getAllCenters);
router.get("/:id", getCenterById);
router.post("/", createCenter);
router.put("/:id", updateCenter);
router.delete("/:id", deleteCenter);

export default router;
