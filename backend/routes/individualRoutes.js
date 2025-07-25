import express from "express";
import {
  signup,
  login,
  logout,
  requireAuth,
  getProfile,
  forgotPassword,
  resetPassword,
} from "../controllers/individualController.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/profile", requireAuth, getProfile);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;
