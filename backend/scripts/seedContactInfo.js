import mongoose from "mongoose";
import ContactInfo from "../models/ContactInfo.js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/iicpa");
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

// Default contact information data
const defaultContactInfo = [
  {
    title: "Our Address",
    content: "3149 New Creek Road, <br />Huntsville, Alabama, USA",
    icon: "FaMapMarkerAlt",
    bg: "from-purple-100 to-white",
    isActive: true,
    order: 0,
  },
  {
    title: "Contact Number",
    content: "+12 (00) 123 456789 <br /> +91 (000) 1245 8963",
    icon: "FaPhoneAlt",
    bg: "from-pink-100 to-white",
    isActive: true,
    order: 1,
  },
  {
    title: "Email Address",
    content: "info@domain.com <br /> support@domain.com",
    icon: "FaEnvelope",
    bg: "from-yellow-100 to-white",
    isActive: true,
    order: 2,
  },
  {
    title: "Class Schedule",
    content: "10:00 AM - 6:00 PM <br /> Monday - Friday",
    icon: "FaClock",
    bg: "from-green-100 to-white",
    isActive: true,
    order: 3,
  },
];

// Function to seed contact information
const seedContactInfo = async () => {
  try {
    // Clear existing contact info
    await ContactInfo.deleteMany({});
    console.log("Cleared existing contact information");

    // Insert default contact info
    const insertedContactInfo = await ContactInfo.insertMany(defaultContactInfo);
    console.log(`Inserted ${insertedContactInfo.length} contact information entries`);

    console.log("Contact information seeded successfully!");
  } catch (error) {
    console.error("Error seeding contact information:", error);
  }
};

// Main function
const main = async () => {
  await connectDB();
  await seedContactInfo();
  await mongoose.connection.close();
  console.log("Database connection closed");
  process.exit(0);
};

// Run the script
main().catch((error) => {
  console.error("Script error:", error);
  process.exit(1);
});
