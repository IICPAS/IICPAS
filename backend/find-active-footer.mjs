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

// Check all footer entries and find the one being returned
const findActiveFooter = async () => {
  try {
    console.log("🔍 Finding the active footer being returned by API...");

    const db = mongoose.connection.db;
    const footersCollection = db.collection("footers");

    // Find the footer that matches the API response
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

      // Check if this matches the API response
      if (footer.companyInfo?.name === "sss") {
        console.log("   🎯 This matches the API response!");
      }
    });

    // Find the active footer
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
  await findActiveFooter();
  await mongoose.disconnect();
  console.log("👋 Disconnected from MongoDB");
};

runCheck();
