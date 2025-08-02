import Individual from "../models/Individual.js";
import { signJwt, cookieOptions } from "../utils/auth.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// ========================

// ✅ Nodemailer Setup
// ========================
const sendEmail = async (to, subject, html) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER, // example: aritra.codemap2024@gmail.com
      pass: process.env.EMAIL_PASS, // App password
    },
  });

  await transporter.sendMail({
    from: `"IICPA Support" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
};

// ========================
// ✅ Signup
// ========================
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

// ========================
// ✅ Login
// ========================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Individual.findOne({ email }).select("+password");
    if (!user || !(await user.comparePassword(password)))
      return res.status(400).json({ error: "Invalid credentials" });

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
    res.status(500).json({ error: err.message });
  }
};

// ========================
// ✅ Logout
// ========================
export const logout = (req, res) => {
  res.clearCookie("jwt", cookieOptions);
  res.json({ message: "Logged out" });
};

// ========================
// ✅ Middleware: requireAuth
// ========================
export const requireAuth = async (req, res, next) => {
  try {
    console.log(req);
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

// ========================
// ✅ Get Profile
// ========================
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

// ========================
// ✅ Forgot Password (Send token via email)
// ========================
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await Individual.findOne({ email });
    if (!user) return res.status(404).json({ error: "Email not found" });

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1 hour
    await user.save({ validateBeforeSave: false });

    const resetURL = `${
      process.env.CLIENT_URL || "http://localhost:3000"
    }/individual/reset`;

    const message = `
      <div>
        <h2>Hello ${user.name},</h2>
        <p>You requested a password reset. Use the token below in the reset form:</p>
        <p style="font-weight:bold; font-size:18px;">${resetToken}</p>
        <p>Or visit: <a href="${resetURL}" target="_blank">${resetURL}</a></p>
        <p>If you didn’t request this, you can safely ignore it.</p>
      </div>
    `;

    await sendEmail(user.email, "Reset your IICPA password", message);
    res.json({ message: "Reset token sent to your email." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ========================
// ✅ Reset Password (Validate token and update password)
// ========================
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

    if (!user)
      return res.status(400).json({ error: "Invalid or expired token" });
    if (req.body.password !== req.body.confirmPassword)
      return res.status(400).json({ error: "Passwords do not match" });

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    const token = signJwt(user._id);
    res.cookie("jwt", token, cookieOptions);
    res.json({
      message: "Password has been reset",
      user: { id: user._id, name: user.name },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ========================
// ✅ Update Profile
// ========================
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { name, phone, password, confirmPassword } = req.body;

    if (!name && !phone && !password) {
      return res.status(400).json({ error: "No fields to update" });
    }

    const user = await Individual.findById(userId).select("+password");
    if (!user) return res.status(404).json({ error: "User not found" });

    if (name) user.name = name;
    if (phone) user.phone = phone;

    if (password || confirmPassword) {
      if (!password || !confirmPassword)
        return res.status(400).json({ error: "Both password fields required" });
      if (password !== confirmPassword)
        return res.status(400).json({ error: "Passwords do not match" });
      user.password = password;
    }

    await user.save();
    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
      message: "Profile updated successfully",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
