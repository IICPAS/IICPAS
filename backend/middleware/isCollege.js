import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const isCollege = (req, res, next) => {
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "college")
      return res.status(403).json({ message: "Forbidden" });
    req.college = decoded;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};
