// routes/authRoutes.js
import express from "express";
import {
  login,
  register,
  logout,
  userSignup,
  userLogin,
  updateAdminProfile,
} from "../controllers/authControllers.js";
import adminAuth from "../middleware/adminAuth.js";

const router = express.Router();

router.post("/register", register); // public
router.post("/login", login); // public
router.post("/logout", logout); // admin logout

// User (Individual) auth
router.post("/user/signup", userSignup); // public
router.post("/user/login", userLogin); // public
router.post("/user/logout", logout); // user logout

router.get("/admin-only", adminAuth, (req, res) => {
  res.json({ message: "Hello superadmin!", user: req.user });
});

// Admin profile update route
router.put("/profile", adminAuth, updateAdminProfile);

export default router;
