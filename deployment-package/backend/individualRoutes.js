import express from "express";
import {
  signup,
  login,
  logout,
  getProfile,
  forgotPassword,
  resetPassword,
  updateProfile,
  uploadDocument,
  getDocument,
  deleteDocument,
  uploadImage,
  getUserDocuments,
  deleteImage,
  createTrainingRequest,
  getUserTrainingRequests,
  getAllTrainingRequests,
  updateTrainingRequestStatus,
} from "../controllers/individualController.js";
import { requireAuth, requirePermission } from "../middleware/requireAuth.js";
import uploadIndividualDoc from "../middleware/individualUpload.js";
import uploadIndividualImage from "../middleware/individualImageUpload.js";

const router = express.Router();

// Test endpoint to check if routes are working
router.get("/test", (req, res) => {
  res.json({ message: "Individual routes are working!" });
});

// Signup with optional image and document upload
router.post(
  "/signup",
  uploadIndividualDoc.fields([
    { name: "image", maxCount: 1 },
    { name: "document", maxCount: 1 },
  ]),
  signup
);
router.post("/login", login);
router.post("/logout", logout);
// router.get("/profile", requireAuth, getProfile);

// Profile update with image upload
router.put(
  "/profile",
  requireAuth,
  uploadIndividualImage.single("profileImage"),
  updateProfile
);

// Document routes - No authentication required
router.post(
  "/upload-document",
  uploadIndividualDoc.single("document"),
  uploadDocument
);
router.post("/document", getDocument); // Changed to POST to send email in body
router.delete("/document", deleteDocument);

// Image routes - No authentication required
router.post(
  "/upload-image",
  uploadIndividualImage.single("image"),
  uploadImage
);
router.delete("/image", deleteImage);

// Documents management routes
router.post("/documents", getUserDocuments);

router.get("/profile-valid", requireAuth, (req, res) => {
  console.log("Profile-valid endpoint called");
  console.log("User object:", req.user);
  res.status(200).json({
    success: true,
    message: "Individual is authenticated",
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      phone: req.user.phone,
      image: req.user.image,
      document: req.user.document,
    },
  });
});
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// ========================
// Training Request Routes
// ========================

// Create training request (Individual users)
router.post(
  "/training-requests",
  uploadIndividualDoc.single("resume"),
  createTrainingRequest
);

// Get user's training requests (Individual users)
router.get("/training-requests", getUserTrainingRequests);

// Get all training requests (Admin only)
router.get(
  "/admin/training-requests",
  requireAuth,
  requirePermission("individual-requests", "read"),
  getAllTrainingRequests
);

// Update training request status (Admin only)
router.put(
  "/admin/training-requests/:requestId",
  requireAuth,
  requirePermission("individual-requests", "update"),
  updateTrainingRequestStatus
);

export default router;
