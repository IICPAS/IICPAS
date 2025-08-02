import express from "express";
import {
  signup,
  login,
  logout,
  getProfile,
  forgotPassword,
  resetPassword,
  updateProfile,
} from "../controllers/individualController.js";
import { requireAuth } from "../middleware/requireAuth.js";
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
// router.get("/profile", requireAuth, getProfile);

router.put("/profile", requireAuth, updateProfile);

router.get("/profile-valid", requireAuth, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Individual is authenticated",
    user: req.user,
  });
});
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;
