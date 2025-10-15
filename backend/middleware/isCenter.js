import jwt from "jsonwebtoken";
import Center from "../models/Center.js";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET =
  process.env.JWT_SECRET || "default_jwt_secret_for_development";

export const isCenter = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Check if the role is center
    if (decoded.role !== "center") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Invalid role.",
      });
    }

    // Find center and check if it exists and is approved
    const center = await Center.findById(decoded.id);
    if (!center) {
      return res.status(401).json({
        success: false,
        message: "Access denied. Center not found.",
      });
    }

    if (center.status !== "approved" && center.status !== "active") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Center not approved.",
      });
    }

    // Add center info to request
    req.center = center;
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Center authentication error:", error);
    return res.status(401).json({
      success: false,
      message: "Access denied. Invalid token.",
    });
  }
};
