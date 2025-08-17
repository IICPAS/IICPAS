// middleware/isTeacher.js
import Teacher from "../models/Teacher.js";

export const isTeacher = async (req, res, next) => {
  try {
    const teacher = await Teacher.findById(req.user.id);
    if (!teacher) {
      return res.status(403).json({ message: "Access denied. Teacher only." });
    }
    
    req.teacher = teacher;
    next();
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
