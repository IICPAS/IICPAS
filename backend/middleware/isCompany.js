import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

export const isCompany = (req, res, next) => {
  const token = req.cookies.token;
  //   console.log(token);
  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  //   try {
  // console.log("Hi");
  console.log(JWT_SECRET);
  const decoded = jwt.verify(token, JWT_SECRET);
  console.log(decoded);
  if (decoded.role !== "company") {
    return res.status(403).json({ message: "Access denied. Not a company." });
  }

  req.company = decoded; // You can access req.company.id in controller
  next();
  //   } catch (err) {
  //     return res.status(400).json({ message: "Invalid or expired token." });
  //   }
};
