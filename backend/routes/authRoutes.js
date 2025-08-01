// routes/authRoutes.js
import express from "express";
import {
  login,
  register,
  logout,
  userSignup,
  userLogin,
} from "../controllers/authControllers.js";
import { isAdmin } from "../middleware/isAdmin.js";

const router = express.Router();

router.post("/register", register); // public
router.post("/login", login); // public
router.post("/logout", logout); // admin logout

// User (Individual) auth
router.post("/user/signup", userSignup); // public
router.post("/user/login", userLogin); // public
router.post("/user/logout", logout); // user logout

router.get("/admin-only", isAdmin, (req, res) => {
  res.json({ message: "Hello superadmin!", user: req.user });
});

export default router;
