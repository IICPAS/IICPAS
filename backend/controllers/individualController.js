import Individual from "../models/Individual.js";
import { signJwt, cookieOptions } from "../utils/auth.js";
import crypto from "crypto";

// Signup
export const signup = async (req, res) => {
  try {
    const { name, email, phone, password, confirmPassword } = req.body;
    if (!name || !email || !phone || !password || !confirmPassword)
      return res.status(400).json({ error: "All fields required" });
    if (password !== confirmPassword)
      return res.status(400).json({ error: "Passwords do not match" });

    const exists = await Individual.findOne({ email });
    if (exists) return res.status(400).json({ error: "Email already exists" });

    const user = await Individual.create({ name, email, phone, password });
    const token = signJwt(user._id);
    res.cookie("jwt", token, cookieOptions);
    res.status(201).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Individual.findOne({ email }).select("+password");
    if (!user || !(await user.comparePassword(password)))
      return res.status(400).json({ error: "Invalid credentials" });

    const token = signJwt(user._id);
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
    res.status(500).json({ error: err.message });
  }
};

// Logout
export const logout = (req, res) => {
  res.clearCookie("jwt", cookieOptions);
  res.json({ message: "Logged out" });
};

// Middleware to protect routes
export const requireAuth = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) return res.status(401).json({ error: "Not authenticated" });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await Individual.findById(decoded.id);
    if (!user) return res.status(401).json({ error: "Not authenticated" });
    req.user = user;
    next();
  } catch {
    return res.status(401).json({ error: "Not authenticated" });
  }
};

// Get Profile
export const getProfile = async (req, res) => {
  res.json({
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      phone: req.user.phone,
    },
  });
};

// Forgot Password (send token to email)
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await Individual.findOne({ email });
    if (!user) return res.status(404).json({ error: "Email not found" });

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save({ validateBeforeSave: false });

    // send token via email (for demo, return in response)
    res.json({ resetToken });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Reset Password (from token)
export const resetPassword = async (req, res) => {
  try {
    const hashedToken = crypto
      .createHash("sha256")
      .update(req.body.token)
      .digest("hex");
    const user = await Individual.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    }).select("+password");
    if (!user) return res.status(400).json({ error: "Invalid/expired token" });

    if (req.body.password !== req.body.confirmPassword)
      return res.status(400).json({ error: "Passwords do not match" });

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    const token = signJwt(user._id);
    res.cookie("jwt", token, cookieOptions);
    res.json({
      message: "Password reset",
      user: { id: user._id, name: user.name },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
