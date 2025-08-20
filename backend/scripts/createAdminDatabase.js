import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

// Configure dotenv
dotenv.config();

// MongoDB connection string for production
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/iicpa";

// Admin user data
const adminData = {
  name: "Admin User",
  email: "admin@iicpa.com",
  password: "admin123",
  role: "Admin",
  status: "Active",
  permissions: {
    "course-category": {
      add: true,
      read: true,
      update: true,
      delete: true,
      active: true,
    },
    course: { add: true, read: true, update: true, delete: true, active: true },
    "live-session": {
      add: true,
      read: true,
      update: true,
      delete: true,
      active: true,
    },
    blogs: { add: true, read: true, update: true, delete: true, active: true },
    testimonials: {
      add: true,
      read: true,
      update: true,
      delete: true,
      active: true,
    },
    about: { add: true, read: true, update: true, delete: true, active: true },
    meta: { add: true, read: true, update: true, delete: true, active: true },
    alert: { add: true, read: true, update: true, delete: true, active: true },
    enquiries: {
      add: true,
      read: true,
      update: true,
      delete: true,
      active: true,
    },
    jobs: { add: true, read: true, update: true, delete: true, active: true },
    news: { add: true, read: true, update: true, delete: true, active: true },
    center: { add: true, read: true, update: true, delete: true, active: true },
    students: {
      add: true,
      read: true,
      update: true,
      delete: true,
      active: true,
    },
    staff: { add: true, read: true, update: true, delete: true, active: true },
    companies: {
      add: true,
      read: true,
      update: true,
      delete: true,
      active: true,
    },
    colleges: {
      add: true,
      read: true,
      update: true,
      delete: true,
      active: true,
    },
    calendar: {
      add: true,
      read: true,
      update: true,
      delete: true,
      active: true,
    },
    team: { add: true, read: true, update: true, delete: true, active: true },
    topics: { add: true, read: true, update: true, delete: true, active: true },
    revision: {
      add: true,
      read: true,
      update: true,
      delete: true,
      active: true,
    },
    support: {
      add: true,
      read: true,
      update: true,
      delete: true,
      active: true,
    },
  },
};

async function createAdminInDatabase() {
  try {
    console.log("🚀 Creating admin user directly in database...");
    console.log(
      "📡 MongoDB URI:",
      MONGODB_URI.replace(/\/\/.*@/, "//***:***@")
    );

    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Create Employee schema inline (in case model isn't available)
    const employeeSchema = new mongoose.Schema(
      {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        role: {
          type: String,
          enum: ["Admin", "Manager", "Employee"],
          default: "Employee",
        },
        status: {
          type: String,
          enum: ["Active", "Inactive"],
          default: "Active",
        },
        permissions: { type: Object, default: {} },
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
      },
      { timestamps: true }
    );

    // Hash password before saving
    employeeSchema.pre("save", async function (next) {
      if (!this.isModified("password")) return next();
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
      next();
    });

    // Method to compare password
    employeeSchema.methods.comparePassword = async function (enteredPassword) {
      return await bcrypt.compare(enteredPassword, this.password);
    };

    const Employee =
      mongoose.models.Employee || mongoose.model("Employee", employeeSchema);

    // Check if admin already exists
    const existingAdmin = await Employee.findOne({ email: adminData.email });
    if (existingAdmin) {
      console.log("✅ Admin user already exists!");
      console.log("📧 Email:", adminData.email);
      console.log("🔑 Password: admin123");
      console.log("👤 Role:", existingAdmin.role);
      console.log("✅ Status:", existingAdmin.status);
      return;
    }

    // Create new admin user
    const admin = new Employee(adminData);
    await admin.save();

    console.log("✅ Admin user created successfully in database!");
    console.log("📧 Email:", adminData.email);
    console.log("🔑 Password: admin123");
    console.log("👤 Role: Admin");
    console.log("✅ Status: Active");
    console.log("🔐 All permissions granted");
    console.log("🌐 Login URL: https://www.iicpa.in/admin");
    console.log("🎯 Dashboard URL: https://www.iicpa.in/admin-dashboard");
  } catch (error) {
    console.error("❌ Error creating admin in database:", error.message);

    if (error.code === 11000) {
      console.log("ℹ️ Admin user already exists. Try logging in with:");
      console.log("📧 Email: admin@iicpa.com");
      console.log("🔑 Password: admin123");
    }
  } finally {
    await mongoose.connection.close();
    console.log("🔌 Database connection closed");
  }
}

// Run the script
createAdminInDatabase();
