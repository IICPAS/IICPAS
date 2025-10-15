import jwt from "jsonwebtoken";
import Employee from "../models/Employee.js";

const requireAuth = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "default_jwt_secret_for_development"
      );

      // Get employee from token
      req.user = await Employee.findById(decoded.id).select("-password");

      if (!req.user) {
        return res
          .status(401)
          .json({ message: "Not authorized, user not found" });
      }

      // Check if employee is active
      if (req.user.status !== "Active") {
        return res.status(401).json({ message: "Account is inactive" });
      }

      next();
    } catch (error) {
      console.error("Auth middleware error:", error);
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

// Middleware to check specific permission
const requirePermission = (module, action) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    if (!req.user.hasPermission(module, action)) {
      return res.status(403).json({
        message: `Access denied. You don't have ${action} permission for ${module}`,
      });
    }

    next();
  };
};

// Middleware to check if user has read access to module
const requireReadAccess = (module) => {
  return requirePermission(module, "read");
};

// Middleware to check if user has write access to module
const requireWriteAccess = (module) => {
  return requirePermission(module, "add");
};

export {
  requireAuth,
  requirePermission,
  requireReadAccess,
  requireWriteAccess,
};
