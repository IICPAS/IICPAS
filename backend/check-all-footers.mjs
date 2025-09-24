import mongoose from "mongoose";

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/iicpa"
    );
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
};

// Check all footer entries
const checkAllFooters = async () => {
  try {
    console.log("🔍 Checking all footer entries...");

    const db = mongoose.connection.db;
    const footersCollection = db.collection("footers");

    const footers = await footersCollection.find({}).toArray();
    console.log(`📊 Found ${footers.length} footer entries:`);

    footers.forEach((footer, index) => {
      console.log(`\n📋 Footer ${index + 1}:`);
      console.log(`   ID: ${footer._id}`);
      console.log(`   Company: ${footer.companyInfo?.name || "N/A"}`);
      console.log(`   Active: ${footer.isActive || false}`);
      console.log(
        `   Footer Links Keys: ${Object.keys(footer.footerLinks || {}).join(
          ", "
        )}`
      );

      if (footer.footerLinks) {
        if (footer.footerLinks.companyPolicies) {
          console.log(
            `   Company Policies: ${footer.footerLinks.companyPolicies.length} items`
          );
        }
        if (footer.footerLinks.generalLinks) {
          console.log(
            `   General Links: ${footer.footerLinks.generalLinks.length} items`
          );
        }
      }
    });

    // Check which footer is active
    const activeFooter = await footersCollection.findOne({ isActive: true });
    if (activeFooter) {
      console.log("\n✅ Active footer found:", activeFooter._id);
      console.log("   Company:", activeFooter.companyInfo?.name);
      console.log(
        "   Structure:",
        Object.keys(activeFooter.footerLinks || {}).join(", ")
      );
    } else {
      console.log("\n⚠️  No active footer found");
    }
  } catch (error) {
    console.error("❌ Error:", error);
  }
};

// Run the check
const runCheck = async () => {
  await connectDB();
  await checkAllFooters();
  await mongoose.disconnect();
  console.log("👋 Disconnected from MongoDB");
};

runCheck();
