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
    console.log("=== SIGNUP DEBUG ===");
    console.log("Request headers:", req.headers);
    console.log("Request body:", req.body);
    console.log("Request files:", req.files);
    console.log("Content-Type:", req.headers["content-type"]);

    // For multipart/form-data, fields are available in req.body
    const { name, email, phone, password, confirmPassword } = req.body;

    console.log("Extracted fields:", {
      name,
      email,
      phone,
      password: !!password,
      confirmPassword: !!confirmPassword,
    });

    if (!name || !email || !phone || !password || !confirmPassword) {
      console.log("Missing fields:", {
        name,
        email,
        phone,
        password: !!password,
        confirmPassword: !!confirmPassword,
      });
      return res.status(400).json({ error: "All fields required" });
    }

    if (password !== confirmPassword)
      return res.status(400).json({ error: "Passwords do not match" });

    const exists = await Individual.findOne({ email });
    if (exists) return res.status(400).json({ error: "Email already exists" });

    // Create user object with image and document if uploaded
    const userData = { name, email, phone, password };

    // Handle files from fields middleware
    if (req.files) {
      if (req.files.image && req.files.image[0]) {
        userData.image = req.files.image[0].path;
      }
      if (req.files.document && req.files.document[0]) {
        userData.document = req.files.document[0].path;
      }
    }

    const user = await Individual.create(userData);
    const token = signJwt(user._id);
    res.cookie("jwt", token, cookieOptions);
    res.status(201).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        image: user.image,
        document: user.document,
      },
    });
  } catch (err) {
    console.error("Signup error:", err);
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

    const token = signJwt(user._id, user.email, user.name, user.image);
    res.cookie("jwt", token, cookieOptions);
    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        image: user.image,
        document: user.document,
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
    console.log("=== UPDATE PROFILE DEBUG ===");
    console.log("User object:", req.user);
    console.log("Request body:", req.body);
    console.log("Request file:", req.file);
    console.log("Request files:", req.files);

    const userId = req.user._id; // Changed from req.user.id to req.user._id

    const { name, phone, password, confirmPassword } = req.body;

    if (!name && !phone && !password && !req.file) {
      console.log("No fields to update");
      return res.status(400).json({ error: "No fields to update" });
    }

    const user = await Individual.findById(userId).select("+password");
    if (!user) return res.status(404).json({ error: "User not found" });

    console.log("Found user:", {
      id: user._id,
      name: user.name,
      email: user.email,
      currentImage: user.image,
    });

    if (name) user.name = name;
    if (phone) user.phone = phone;

    // Handle image upload
    if (req.file) {
      console.log("Processing image upload:", req.file.path);
      user.image = req.file.path;
    }

    if (password || confirmPassword) {
      if (!password || !confirmPassword)
        return res.status(400).json({ error: "Both password fields required" });
      if (password !== confirmPassword)
        return res.status(400).json({ error: "Passwords do not match" });
      user.password = password;
    }

    await user.save();
    console.log("User saved with new image:", user.image);

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        image: user.image,
        document: user.document,
      },
      message: "Profile updated successfully",
    });
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ error: err.message });
  }
};

// ========================
// ✅ Upload Document
// ========================
export const uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No document uploaded" });
    }

    const { email, name } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    // Find user by email
    const user = await Individual.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found with this email" });
    }

    // Update user with document path
    user.document = req.file.path;
    await user.save();

    res.json({
      message: "Document uploaded successfully",
      document: req.file.path,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        document: user.document,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ========================
// ✅ Get Document
// ========================
export const getDocument = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const user = await Individual.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found with this email" });
    }

    if (!user.document) {
      return res.status(404).json({ error: "No document uploaded" });
    }

    res.json({
      document: user.document,
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
// ✅ Delete Document
// ========================
export const deleteDocument = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const user = await Individual.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found with this email" });
    }

    if (!user.document) {
      return res.status(404).json({ error: "No document to delete" });
    }

    // Remove document path from user
    user.document = undefined;
    await user.save();

    res.json({
      message: "Document deleted successfully",
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
// ✅ Upload Image
// ========================
export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image uploaded" });
    }

    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    // Find user by email
    const user = await Individual.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found with this email" });
    }

    // Update user with image path
    user.image = req.file.path;
    await user.save();

    res.json({
      message: "Image uploaded successfully",
      image: req.file.path,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        image: user.image,
        document: user.document,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ========================
// ✅ Get User Documents
// ========================
export const getUserDocuments = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const user = await Individual.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found with this email" });
    }

    const documents = [];

    if (user.image) {
      documents.push({
        type: "image",
        name: "Profile Image",
        path: user.image,
        filename: user.image.split("/").pop(),
        uploadedAt: user.updatedAt,
      });
    }

    if (user.document) {
      documents.push({
        type: "document",
        name: "Uploaded Document",
        path: user.document,
        filename: user.document.split("/").pop(),
        uploadedAt: user.updatedAt,
      });
    }

    res.json({
      documents,
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
// ✅ Delete Image
// ========================
export const deleteImage = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const user = await Individual.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found with this email" });
    }

    if (!user.image) {
      return res.status(404).json({ error: "No image to delete" });
    }

    // Remove image path from user
    user.image = undefined;
    await user.save();

    res.json({
      message: "Image deleted successfully",
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
