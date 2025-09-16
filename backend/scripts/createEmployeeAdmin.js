import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Configure dotenv
dotenv.config();

// Get current file directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Import the Employee model
const Employee = await import('../models/Employee.js').then(m => m.default);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Admin employee data
const adminData = {
  name: "Super Admin",
  email: "admin@iicpa.com",
  password: "admin123", // This will be hashed
  role: "Admin",
  status: "Active",
  permissions: {
    // Course Management
    "course-category": {
      add: true,
      read: true,
      update: true,
      delete: true,
      active: true,
    },
    course: {
      add: true,
      read: true,
      update: true,
      delete: true,
      active: true,
    },
    "live-session": {
      add: true,
      read: true,
      update: true,
      delete: true,
      active: true,
    },
    // Website Settings
    blogs: {
      add: true,
      read: true,
      update: true,
      delete: true,
      active: true,
    },
    testimonials: {
      add: true,
      read: true,
      update: true,
      delete: true,
      active: true,
    },
    about: {
      add: true,
      read: true,
      update: true,
      delete: true,
      active: true,
    },
    hero: {
      add: true,
      read: true,
      update: true,
      delete: true,
      active: true,
    },
    meta: {
      add: true,
      read: true,
      update: true,
      delete: true,
      active: true,
    },
    alert: {
      add: true,
      read: true,
      update: true,
      delete: true,
      active: true,
    },
    // Other Modules
    enquiries: {
      add: true,
      read: true,
      update: true,
      delete: true,
      active: true,
    },
    jobs: {
      add: true,
      read: true,
      update: true,
      delete: true,
      active: true,
    },
    news: {
      add: true,
      read: true,
      update: true,
      delete: true,
      active: true,
    },
    center: {
      add: true,
      read: true,
      update: true,
      delete: true,
      active: true,
    },
    students: {
      add: true,
      read: true,
      update: true,
      delete: true,
      active: true,
    },
    staff: {
      add: true,
      read: true,
      update: true,
      delete: true,
      active: true,
    },
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
    team: {
      add: true,
      read: true,
      update: true,
      delete: true,
      active: true,
    },
    topics: {
      add: true,
      read: true,
      update: true,
      delete: true,
      active: true,
    },
    guides: {
      add: true,
      read: true,
      update: true,
      delete: true,
      active: true,
    },
    kits: {
      add: true,
      read: true,
      update: true,
      delete: true,
      active: true,
    },
    "revision-tests": {
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
    audit: {
      add: true,
      read: true,
      update: true,
      delete: true,
      active: true,
    },
  }
};

async function createEmployeeAdmin() {
  try {
    // Check if admin already exists
    const existingAdmin = await Employee.findOne({ email: adminData.email });
    if (existingAdmin) {
      console.log('Admin employee already exists!');
      console.log('Email:', existingAdmin.email);
      console.log('Role:', existingAdmin.role);
      process.exit(0);
    }

    // Create admin employee
    const admin = new Employee(adminData);
    await admin.save();

    console.log('✅ Admin employee created successfully!');
    console.log('Email:', admin.email);
    console.log('Password:', adminData.password);
    console.log('Role:', admin.role);

  } catch (error) {
    console.error('❌ Error creating admin employee:', error.message);
  } finally {
    // Close the database connection
    mongoose.connection.close();
    process.exit(0);
  }
}

// Run the script
createEmployeeAdmin();
