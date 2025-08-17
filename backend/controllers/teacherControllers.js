// controllers/teacherControllers.js
import Teacher from "../models/Teacher.js";
import jwt from "jsonwebtoken";
import { signJwt, cookieOptions } from "../utils/auth.js";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

// Teacher registration
export const teacherRegister = async (req, res) => {
  const {
    name,
    email,
    password,
    phone,
    specialization,
    experience,
    qualification,
    bio,
  } = req.body;

  try {
    const exists = await Teacher.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Teacher already exists" });
    }

    const teacher = await Teacher.create({
      name,
      email,
      password,
      phone,
      specialization,
      experience,
      qualification,
      bio,
    });

    const token = signJwt(teacher._id, teacher.email, teacher.name);
    res.cookie("jwt", token, cookieOptions);

    res.status(201).json({
      message: "Teacher registered successfully",
      teacher: {
        id: teacher._id,
        name: teacher.name,
        email: teacher.email,
        phone: teacher.phone,
        specialization: teacher.specialization,
        experience: teacher.experience,
        qualification: teacher.qualification,
        bio: teacher.bio,
      },
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error registering teacher", error: err.message });
  }
};

// Teacher login
export const teacherLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const teacher = await Teacher.findOne({ email }).select("+password");
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    const isMatch = await teacher.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = signJwt(teacher._id, teacher.email, teacher.name);
    res.cookie("jwt", token, cookieOptions);

    res.json({
      message: "Teacher logged in successfully",
      teacher: {
        id: teacher._id,
        name: teacher.name,
        email: teacher.email,
        phone: teacher.phone,
        specialization: teacher.specialization,
        experience: teacher.experience,
        qualification: teacher.qualification,
        bio: teacher.bio,
        courses: teacher.courses,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Error logging in", error: err.message });
  }
};

// Get teacher profile
export const getTeacherProfile = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.teacher.id).populate("courses");
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    res.json({
      teacher: {
        id: teacher._id,
        name: teacher.name,
        email: teacher.email,
        phone: teacher.phone,
        specialization: teacher.specialization,
        experience: teacher.experience,
        qualification: teacher.qualification,
        bio: teacher.bio,
        courses: teacher.courses,
        profileImage: teacher.profileImage,
      },
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching profile", error: err.message });
  }
};

// Update teacher profile
export const updateTeacherProfile = async (req, res) => {
  const { name, phone, specialization, experience, qualification, bio } =
    req.body;

  try {
    const teacher = await Teacher.findById(req.teacher.id);
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    teacher.name = name || teacher.name;
    teacher.phone = phone || teacher.phone;
    teacher.specialization = specialization || teacher.specialization;
    teacher.experience = experience || teacher.experience;
    teacher.qualification = qualification || teacher.qualification;
    teacher.bio = bio || teacher.bio;
    teacher.updatedAt = Date.now();

    await teacher.save();

    res.json({
      message: "Profile updated successfully",
      teacher: {
        id: teacher._id,
        name: teacher.name,
        email: teacher.email,
        phone: teacher.phone,
        specialization: teacher.specialization,
        experience: teacher.experience,
        qualification: teacher.qualification,
        bio: teacher.bio,
      },
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating profile", error: err.message });
  }
};

// Get all teachers (for admin)
export const getAllTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find({})
      .select("-password")
      .populate("courses");
    res.json({ teachers });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching teachers", error: err.message });
  }
};

// Get teacher by ID
export const getTeacherById = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id)
      .select("-password")
      .populate("courses");
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }
    res.json({ teacher });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching teacher", error: err.message });
  }
};

// Delete teacher (for admin)
export const deleteTeacher = async (req, res) => {
  try {
    const teacher = await Teacher.findByIdAndDelete(req.params.id);
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }
    res.json({ message: "Teacher deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting teacher", error: err.message });
  }
};
