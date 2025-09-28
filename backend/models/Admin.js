// models/Admin.js
import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  phone: { type: String, default: "" },
  image: { type: String, default: "" },
  role: { type: String, enum: ["superadmin", "hr", "sales"], default: "sales" },
  
  // Personal Information
  bio: { type: String, default: "" },
  address: {
    street: { type: String, default: "" },
    city: { type: String, default: "" },
    state: { type: String, default: "" },
    pincode: { type: String, default: "" },
    country: { type: String, default: "India" }
  },
  dateOfBirth: { type: Date, default: null },
  gender: { type: String, enum: ["male", "female", "other", ""], default: "" },
  
  // Professional Information
  department: { type: String, default: "" },
  designation: { type: String, default: "" },
  employeeId: { type: String, default: "" },
  joiningDate: { type: Date, default: null },
  experience: { type: String, default: "" },
  qualifications: { type: String, default: "" },
  
  // Social Links
  socialLinks: {
    linkedin: { type: String, default: "" },
    twitter: { type: String, default: "" },
    facebook: { type: String, default: "" },
    instagram: { type: String, default: "" },
    website: { type: String, default: "" }
  },
  
  // Preferences & Settings
  preferences: {
    theme: { type: String, enum: ["light", "dark", "auto"], default: "light" },
    language: { type: String, default: "en" },
    timezone: { type: String, default: "Asia/Kolkata" },
    notifications: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: true },
      push: { type: Boolean, default: true }
    }
  },
  
  // Field Visibility Settings (what super admin wants to show publicly)
  fieldVisibility: {
    phone: { type: Boolean, default: true },
    address: { type: Boolean, default: false },
    dateOfBirth: { type: Boolean, default: false },
    gender: { type: Boolean, default: false },
    department: { type: Boolean, default: true },
    designation: { type: Boolean, default: true },
    employeeId: { type: Boolean, default: false },
    joiningDate: { type: Boolean, default: false },
    experience: { type: Boolean, default: true },
    qualifications: { type: Boolean, default: true },
    socialLinks: { type: Boolean, default: true },
    bio: { type: Boolean, default: true }
  },
  
  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model("Admin", adminSchema);
