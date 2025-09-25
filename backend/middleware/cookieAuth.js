import jwt from "jsonwebtoken";
import Employee from "../models/Employee.js";
import Admin from "../models/Admin.js";

const cookieAuth = async (req, res, next) => {
  let token;

  // Check for token in cookies first
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  } 
  // Fallback to Authorization header
  else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Try to get admin first, then employee
    let user = await Admin.findById(decoded.id).select("-password");
    if (!user) {
      user = await Employee.findById(decoded.id).select("-password");
    }

    if (!user) {
      return res
        .status(401)
        .json({ message: "Not authorized, user not found" });
    }

    // Check if user is active (for employees)
    if (user.status && user.status !== "Active") {
      return res.status(401).json({ message: "Account is inactive" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Cookie auth middleware error:", error);
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};

export { cookieAuth };
