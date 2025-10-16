import mongoose from "mongoose";
import Employee from "./backend/Employee.js";
import dotenv from "dotenv";

dotenv.config();

const updatePermissions = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");
    
    const adminUsers = await Employee.find({ role: "Admin" });
    console.log(`Found ${adminUsers.length} admin users`);
    
    for (const admin of adminUsers) {
      if (!admin.permissions["individual-requests"]) {
        admin.permissions["individual-requests"] = {
          add: true,
          read: true,
          update: true,
          delete: true,
          active: true,
        };
        await admin.save();
        console.log(`Updated permissions for: ${admin.name}`);
      } else {
        console.log(`Permissions already exist for: ${admin.name}`);
      }
    }
    
    await mongoose.connection.close();
    console.log("Admin permissions updated successfully!");
  } catch (error) {
    console.error("Error updating permissions:", error);
    process.exit(1);
  }
};

updatePermissions();
