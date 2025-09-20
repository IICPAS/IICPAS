import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import Student from "./models/Students.js";

// Load environment variables
dotenv.config();

const addTestStudent = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Check if test student already exists
    const existingStudent = await Student.findOne({
      email: "teststudent@test.com",
    });
    if (existingStudent) {
      console.log("Test student already exists!");
      console.log("Email: teststudent@test.com");
      console.log("Password: test123456");
      console.log("Name:", existingStudent.name);
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash("test123456", 10);

    // Create test student
    const testStudent = new Student({
      name: "Priyanshu Patel",
      email: "teststudent@test.com",
      phone: "9876543210",
      password: hashedPassword,
      location: "Greater Noida",
      // course: [], // Leave empty for now
      // teacher: "Test Teacher", // This field doesn't exist in the schema
    });

    await testStudent.save();
    console.log("Test student created successfully!");
    console.log("Email: teststudent@test.com");
    console.log("Password: test123456");
    console.log("Name: Priyanshu Patel");
  } catch (error) {
    console.error("Error creating test student:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
};

// Run the script
addTestStudent();
