// routes/authRoutes.js
import express from "express";
import { login, register } from "../controllers/authControllers.js";
import { isAdmin } from "../middleware/isAdmin.js";

const router = express.Router();

router.post("/register", register); // public
router.post("/login", login); // public

router.get("/admin-only", isAdmin, (req, res) => {
  res.json({ message: "Hello superadmin!", user: req.user });
});

export default router;
