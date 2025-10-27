import GroupPricing from "../models/GroupPricing.js";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

async function checkGroupPricingSlugs() {
  try {
    const mongoUri =
      process.env.MONGODB_URI || "mongodb://localhost:27017/iicpa";

    console.log("🔗 Connecting to MongoDB...");
    await mongoose.connect(mongoUri);
    console.log("✅ Connected to MongoDB successfully");

    // Get all group pricing records
    const allRecords = await GroupPricing.find({});
    console.log(`📊 Total group pricing records: ${allRecords.length}`);

    // Check for records without slugs
    const recordsWithoutSlugs = await GroupPricing.find({
      $or: [{ slug: { $exists: false } }, { slug: "" }, { slug: null }],
    });

    console.log(`🔍 Records without slugs: ${recordsWithoutSlugs.length}`);

    if (recordsWithoutSlugs.length > 0) {
      console.log("\n📋 Records missing slugs:");
      recordsWithoutSlugs.forEach((record, index) => {
        console.log(`${index + 1}. "${record.groupName}" (ID: ${record._id})`);
      });
      console.log("\n⚠️  Migration needed! Run the migration script.");
    } else {
      console.log("\n🎉 All records have slugs! No migration needed.");
    }

    // Show all records with their slugs
    console.log("\n📋 All group pricing records:");
    allRecords.forEach((record, index) => {
      console.log(
        `${index + 1}. "${record.groupName}" -> slug: "${
          record.slug || "MISSING"
        }"`
      );
    });

    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
    process.exit(0);
  } catch (error) {
    console.error("❌ Check failed:", error);
    process.exit(1);
  }
}

checkGroupPricingSlugs();
