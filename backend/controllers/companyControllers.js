import { Company } from "../models/Company.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "secret123";
const isProd = process.env.NODE_ENV === "production";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

// Register
export const registerCompany = async (req, res) => {
  const { fullName, phone, email, password } = req.body;
  const document = req.file;

  if (!fullName || !email || !phone || !password || !document)
    return res.status(400).json({ message: "All fields required" });

  const exists = await Company.findOne({ email });
  if (exists) return res.status(400).json({ message: "Email already exists" });

  const hashedPassword = await bcrypt.hash(password, 10);

  const company = await Company.create({
    fullName,
    phone,
    email,
    password: hashedPassword,
    documentPath: document.path,
  });

  res.status(201).json({ message: "Company registered, pending approval" });
};

export const loginCompany = async (req, res) => {
  const { email, password } = req.body;

  try {
    const company = await Company.findOne({ email });
    if (!company) return res.status(404).json({ message: "Not registered" });

    if (company.status !== "approved") {
      return res.status(403).json({ message: "Not approved by admin" });
    }

    const isMatch = await bcrypt.compare(password, company.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    console.log(JWT_SECRET);
    const token = jwt.sign(
      {
        id: company._id,
        role: "company",
        name: company.fullName,
        email: company.email,
      },
      JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    // Set token in HttpOnly cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: isProd, // only use HTTPS cookies in production
      sameSite: isProd ? "None" : "Lax", // Lax for dev, None for cross-site prod
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Return response
    res.status(200).json({
      message: "Login successful",
      company: {
        id: company._id,
        name: company.name,
        email: company.email,
        status: company.status,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
};

export const logoutCompany = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
  });

  res.status(200).json({ message: "Logout successful" });
};

// Forgot password — send OTP
export const sendOtp = async (req, res) => {
  const { email } = req.body;
  const company = await Company.findOne({ email });
  if (!company)
    return res.status(404).json({ message: "Email not registered" });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

  company.otp = otp;
  company.otpExpiry = expiry;
  await company.save();

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "IICPA Company OTP Verification",
    html: `<h2>Your OTP is ${otp}</h2><p>It is valid for 10 minutes</p>`,
  });

  res.json({ message: "OTP sent" });
};

// Reset password using OTP
export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  const company = await Company.findOne({ email });

  if (!company || company.otp !== otp || company.otpExpiry < new Date())
    return res.status(400).json({ message: "Invalid or expired OTP" });

  company.password = await bcrypt.hash(newPassword, 10);
  company.otp = null;
  company.otpExpiry = null;
  await company.save();

  res.json({ message: "Password reset successful" });
};

// Admin: Get all companies
export const getAllCompanies = async (_, res) => {
  const companies = await Company.find().sort({ createdAt: -1 });
  res.json(companies);
};

// Admin: Approve company
export const approveCompany = async (req, res) => {
  const company = await Company.findByIdAndUpdate(
    req.params.id,
    { status: "approved" },
    { new: true }
  );
  res.json({ message: "Approved", company });
};
