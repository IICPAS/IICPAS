import Student from "../models/Students.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const isProd = process.env.NODE_ENV === "production";

export const registerStudent = async (req, res) => {
  const { name, email, phone, password, location, course, teacher } = req.body;
  try {
    const existing = await Student.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "Student already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const student = await Student.create({
      name,
      email,
      phone,
      password: hashedPassword,
      location,
      course,
      teacher,
    });

    res.status(201).json({
      message: "Student registered successfully",
      student,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Registration failed", error: error.message });
  }
};

export const loginStudent = async (req, res) => {
  const { email, password } = req.body;
  try {
    const student = await Student.findOne({ email });
    if (!student)
      return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      {
        id: student._id,
        role: "student",
        name: student.name,
        email: student.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? "None" : "Lax",
        maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days
      })
      .status(200)
      .json({
        message: "Login successful",
        student: {
          id: student._id,
          name: student.name,
          email: student.email,
          phone: student.phone,
          course: student.course,
          teacher: student.teacher,
        },
      });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};

export const logoutStudent = (req, res) => {
  res
    .clearCookie("token", {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "None" : "Lax",
    })
    .json({ message: "Logout successful" });
};
