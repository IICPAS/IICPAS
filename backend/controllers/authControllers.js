// controllers/authController.js
import Admin from "../models/Admin.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

export const register = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const exists = await Admin.findOne({ email });
    if (exists)
      return res.status(400).json({ message: "Admin already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const admin = await Admin.create({ name, email, password: hashed, role });

    res.status(201).json({ message: "Registered", admin });
  } catch (err) {
    res.status(500).json({ message: "Error", error: err.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    const match = await bcrypt.compare(password, admin.password);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: admin._id, role: admin.role, name: admin.name },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({ message: "Logged in", token, admin });
  } catch (err) {
    res.status(500).json({ message: "Error", error: err.message });
  }
};
