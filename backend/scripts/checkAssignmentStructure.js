import mongoose from "mongoose";
import Assignment from "../models/Assignment.js";

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/iicpas"
    );
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

const checkStructure = async () => {
  try {
    const assignments = await Assignment.find().limit(1);
    if (assignments.length > 0) {
      console.log("Sample assignment structure:");
      console.log(JSON.stringify(assignments[0], null, 2));
    } else {
      console.log("No assignments found");
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

const main = async () => {
  await connectDB();
  await checkStructure();
  await mongoose.disconnect();
  console.log("Disconnected from MongoDB");
  process.exit(0);
};

main().catch(console.error);
