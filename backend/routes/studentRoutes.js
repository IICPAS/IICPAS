import express from "express";
import {
  registerStudent,
  loginStudent,
  logoutStudent,
} from "../controllers/studentController.js";
import isStudent from "../middleware/isStudent.js";

const router = express.Router();

router.post("/register", registerStudent);
router.post("/login", loginStudent);
router.get("/logout", logoutStudent);
router.get("/protected", isStudent, (req, res) => {
  res.json({ message: "You are a verified student", user: req.user });
});

// GET /api/student/isuser
router.get("/isuser", isStudent, (req, res) => {
  res.json({
    id: req.user.id,
    role: "student",
    email: req.user.email,
    name: req.user.name,
  });
});

export default router;
