// middleware/isAdmin.js
export const isAdmin = (req, res, next) => {
  // Check if user exists (from requireAuth middleware)
  if (!req.user) {
    return res.status(401).json({ message: "Not authorized" });
  }

  // Check if user is admin (role can be "Admin" or "superadmin")
  if (req.user.role !== "Admin" && req.user.role !== "superadmin") {
    return res
      .status(403)
      .json({ message: "Access denied. Admin access required" });
  }

  next();
};
