import mongoose from "mongoose";
import Kit from "../models/Kit.js";
import dotenv from "dotenv";

dotenv.config();

const addSampleKits = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Sample kits data based on the reference image
    const sampleKits = [
      {
        module: "Basic Accounting & Tally Foundation",
        labClassroom: 0,
        recorded: 0,
        labPlusLive: 0,
        description: "Foundation course in accounting and Tally software",
        category: "accounting",
        price: 2500,
        supplier: "Tally Solutions",
      },
      {
        module: "Microsoft Excel",
        labClassroom: 0,
        recorded: 0,
        labPlusLive: 0,
        description: "Advanced Excel training for business applications",
        category: "excel",
        price: 1500,
        supplier: "Microsoft",
      },
      {
        module: "Payroll or Salary Statement",
        labClassroom: 0,
        recorded: 0,
        labPlusLive: 0,
        description: "Payroll processing and salary statement preparation",
        category: "accounting",
        price: 2000,
        supplier: "HR Solutions",
      },
      {
        module: "Income Tax Computation",
        labClassroom: 0,
        recorded: 0,
        labPlusLive: 0,
        description: "Income tax calculation and filing procedures",
        category: "taxation",
        price: 3000,
        supplier: "Tax Institute",
      },
      {
        module: "TDS Computation",
        labClassroom: 0,
        recorded: 0,
        labPlusLive: 0,
        description: "Tax Deducted at Source calculation and compliance",
        category: "taxation",
        price: 2500,
        supplier: "Tax Institute",
      },
      {
        module: "GST Computation",
        labClassroom: 0,
        recorded: 0,
        labPlusLive: 0,
        description: "Goods and Services Tax calculation and procedures",
        category: "gst",
        price: 2800,
        supplier: "GST Academy",
      },
      {
        module: "GST Return Filing",
        labClassroom: 0,
        recorded: 0,
        labPlusLive: 0,
        description: "GST return filing and compliance procedures",
        category: "gst",
        price: 3200,
        supplier: "GST Academy",
      },
      {
        module: "Tally Advanced",
        labClassroom: 0,
        recorded: 0,
        labPlusLive: 0,
        description: "Advanced Tally ERP features and implementation",
        category: "accounting",
        price: 3500,
        supplier: "Tally Solutions",
      },
      {
        module: "ITR Filing (Individual)",
        labClassroom: 0,
        recorded: 0,
        labPlusLive: 0,
        description: "Individual Income Tax Return filing procedures",
        category: "taxation",
        price: 1800,
        supplier: "Tax Institute",
      },
      {
        module: "TDS Return Filing",
        labClassroom: 0,
        recorded: 0,
        labPlusLive: 0,
        description: "TDS return filing and quarterly compliance",
        category: "taxation",
        price: 2200,
        supplier: "Tax Institute",
      },
      {
        module: "PF & ESI Return Filing",
        labClassroom: 0,
        recorded: 0,
        labPlusLive: 0,
        description: "Provident Fund and ESI return filing procedures",
        category: "accounting",
        price: 2000,
        supplier: "HR Solutions",
      },
      {
        module: "Business Taxation",
        labClassroom: 0,
        recorded: 0,
        labPlusLive: 0,
        description: "Business tax planning and compliance",
        category: "taxation",
        price: 4000,
        supplier: "Tax Institute",
      },
      {
        module: "Financial Statements & MIS",
        labClassroom: 0,
        recorded: 0,
        labPlusLive: 0,
        description: "Financial statement preparation and MIS reporting",
        category: "finance",
        price: 3500,
        supplier: "Finance Academy",
      },
      {
        module: "Personal Finance & Literacy",
        labClassroom: 0,
        recorded: 0,
        labPlusLive: 0,
        description: "Personal finance management and financial literacy",
        category: "finance",
        price: 1500,
        supplier: "Finance Academy",
      },
      {
        module: "Microsoft Word",
        labClassroom: 0,
        recorded: 0,
        labPlusLive: 0,
        description: "Advanced Word processing for business documents",
        category: "office",
        price: 1200,
        supplier: "Microsoft",
      },
      {
        module: "Microsoft Powerpoint",
        labClassroom: 0,
        recorded: 0,
        labPlusLive: 0,
        description: "Professional presentation creation and design",
        category: "office",
        price: 1300,
        supplier: "Microsoft",
      },
      {
        module: "Stock Market",
        labClassroom: 0,
        recorded: 0,
        labPlusLive: 0,
        description: "Stock market trading and investment strategies",
        category: "finance",
        price: 5000,
        supplier: "Stock Market Institute",
      },
      {
        module: "Job Readiness Program",
        labClassroom: 0,
        recorded: 0,
        labPlusLive: 0,
        description: "Career preparation and job readiness training",
        category: "communication",
        price: 2500,
        supplier: "Career Institute",
      },
      {
        module: "Communication Skills and Personality Development",
        labClassroom: 0,
        recorded: 0,
        labPlusLive: 0,
        description: "Communication skills and personality enhancement",
        category: "communication",
        price: 2000,
        supplier: "Communication Academy",
      },
      {
        module: "Zoho Books",
        labClassroom: 0,
        recorded: 0,
        labPlusLive: 0,
        description: "Cloud-based accounting software training",
        category: "accounting",
        price: 2800,
        supplier: "Zoho",
      },
      {
        module: "PowerBi",
        labClassroom: 0,
        recorded: 0,
        labPlusLive: 0,
        description: "Business intelligence and data visualization",
        category: "office",
        price: 4500,
        supplier: "Microsoft",
      },
    ];

    // Clear existing kits
    await Kit.deleteMany({});
    console.log("Cleared existing kits");

    // Insert sample kits
    const insertedKits = await Kit.insertMany(sampleKits);
    console.log(`Successfully added ${insertedKits.length} sample kits`);

    // Display the kits
    console.log("\nSample kits added:");
    insertedKits.forEach((kit) => {
      console.log(`- ${kit.module} (${kit.category})`);
    });
  } catch (error) {
    console.error("Error adding sample kits:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
};

// Run the script
addSampleKits();
