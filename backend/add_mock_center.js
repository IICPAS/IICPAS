import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { Center } from "./models/Center.js";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

const createMockCenter = async () => {
  try {
    // Check if mock center already exists
    const existingCenter = await Center.findOne({
      email: "mockcenter@test.com",
    });

    if (existingCenter) {
      console.log("Mock center already exists!");
      console.log("Email: mockcenter@test.com");
      console.log("Password: test123");
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash("test123", 10);

    // Create mock center
    const mockCenter = new Center({
      name: "Mock Learning Center",
      phone: "+91 9876543210",
      email: "mockcenter@test.com",
      password: hashedPassword,
      location: "Greater Noida",
      address: "123 Learning Street, Greater Noida, UP 201310",
      type: "Educational Institute",
      status: "approved", // Set as approved for immediate login
      document: "/uploads/center_docs/mock_document.pdf",
      image: "/uploads/center_docs/mock_center_logo.png",
    });

    await mockCenter.save();

    console.log("✅ Mock center created successfully!");
    console.log("📧 Email: mockcenter@test.com");
    console.log("🔑 Password: test123");
    console.log("📊 Status: approved");
    console.log("🆔 Center ID:", mockCenter._id);
  } catch (error) {
    console.error("❌ Error creating mock center:", error);
  }
};

const main = async () => {
  await connectDB();
  await createMockCenter();
  mongoose.connection.close();
  console.log("✅ Script completed!");
};

main();



