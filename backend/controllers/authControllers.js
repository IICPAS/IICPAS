// controllers/authController.js
import Admin from "../models/Admin.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Individual from "../models/Individual.js";
import { signJwt, cookieOptions } from "../utils/auth.js";

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

    // Set token as httpOnly cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    });

    res.status(200).json({ message: "Logged in", admin });
  } catch (err) {
    res.status(500).json({ message: "Error", error: err.message });
  }
};

export const logout = (req, res) => {
  res.clearCookie("jwt", cookieOptions);
  res.json({ message: "Logged out" });
};

// User (Individual) signup
export const userSignup = async (req, res) => {
  const { name, email, password, phone } = req.body;
  try {
    const exists = await Individual.findOne({ email });
    if (exists) return res.status(400).json({ message: "User already exists" });
    const user = await Individual.create({ name, email, password, phone });
    const token = signJwt(user._id, user.email, user.name);
    res.cookie("jwt", token, cookieOptions);
    res
      .status(201)
      .json({
        message: "Registered",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
        },
      });
  } catch (err) {
    res.status(500).json({ message: "Error", error: err.message });
  }
};

// User (Individual) login
export const userLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await Individual.findOne({ email }).select("+password");
    if (!user || !(await user.comparePassword(password)))
      return res.status(400).json({ message: "Invalid credentials" });
    const token = signJwt(user._id, user.email, user.name);
    res.cookie("jwt", token, cookieOptions);
    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Error", error: err.message });
  }
};
