import jwt from "jsonwebtoken";

const isStudent = (req, res, next) => {
  const token = req.cookies.token;
  console.log("isStudent middleware - token:", token ? "present" : "missing");

  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("isStudent middleware - decoded:", decoded);

    // Handle both old tokens (without role) and new tokens (with role)
    if (decoded.role && decoded.role !== "student") {
      console.log("isStudent middleware - role mismatch:", decoded.role);
      return res.status(403).json({ message: "Access denied" });
    }

    // If no role field, assume it's a student token (backward compatibility)
    if (!decoded.role) {
      console.log(
        "isStudent middleware - old token without role, allowing access"
      );
    }

    req.user = decoded;
    console.log("isStudent middleware - user set:", req.user);
    next();
  } catch (error) {
    console.log(
      "isStudent middleware - token verification error:",
      error.message
    );
    return res.status(401).json({ message: "Invalid token" });
  }
};

export default isStudent;
