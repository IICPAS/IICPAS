import jwt from "jsonwebtoken";

export const requireAuth = (req, res, next) => {
  console.log("Hi");
  const token = req.cookies.jwt; // 👈 named cookie "jwt"

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // decoded payload → { _id, name, email, etc. }
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
