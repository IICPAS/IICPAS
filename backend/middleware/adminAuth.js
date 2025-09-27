// middleware/adminAuth.js
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

const adminAuth = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");

      // Get admin from token
      req.user = await Admin.findById(decoded.id).select("-password");

      if (!req.user) {
        return res
          .status(401)
          .json({ message: "Not authorized, admin not found" });
      }

      next();
    } catch (error) {
      console.error("Admin auth middleware error:", error);
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

export default adminAuth;

