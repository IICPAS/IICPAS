import mongoose from "mongoose";
import Category from "../models/Content/Category.js";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/iicpa");
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

const dummyCategories = [
  {
    category: "Accounting",
    description: "Learn fundamental and advanced accounting principles",
    status: "Active"
  },
  {
    category: "HR",
    description: "Human Resources management and development courses",
    status: "Active"
  },
  {
    category: "Finance",
    description: "Financial management and analysis courses",
    status: "Active"
  },
  {
    category: "Marketing",
    description: "Digital and traditional marketing strategies",
    status: "Active"
  },
  {
    category: "Technology",
    description: "IT and technology skills development",
    status: "Active"
  },
  {
    category: "Management",
    description: "Leadership and management skills",
    status: "Active"
  }
];

const addDummyCategories = async () => {
  try {
    await connectDB();
    
    // Add dummy categories
    for (const categoryData of dummyCategories) {
      const category = new Category(categoryData);
      await category.save();
      console.log(`Added category: ${category.category}`);
    }
    
    console.log("All dummy categories added successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error adding dummy categories:", error);
    process.exit(1);
  }
};

addDummyCategories();
