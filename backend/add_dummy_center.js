import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { Center } from "./models/Center.js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const addDummyCenter = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Check if dummy center already exists
    const existingCenter = await Center.findOne({
      email: "dummycenter@test.com",
    });
    if (existingCenter) {
      console.log("Dummy center already exists!");
      console.log("Email: dummycenter@test.com");
      console.log("Password: test123456");
      console.log("Status:", existingCenter.status);
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash("test123456", 10);

    // Create dummy center
    const dummyCenter = new Center({
      name: "Test Training Center",
      phone: "9876543210",
      email: "dummycenter@test.com",
      password: hashedPassword,
      location: "Greater Noida",
      address: "123 Test Street, Greater Noida, UP",
      type: "Training Institute",
      status: "approved", // Set as approved for immediate login
      document: "", // No document for dummy center
    });

    await dummyCenter.save();
    console.log("Dummy center created successfully!");
    console.log("Email: dummycenter@test.com");
    console.log("Password: test123456");
    console.log("Status: approved");
  } catch (error) {
    console.error("Error creating dummy center:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
};

// Run the script
addDummyCenter();
