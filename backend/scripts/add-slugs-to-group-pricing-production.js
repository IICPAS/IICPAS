import GroupPricing from "../models/GroupPricing.js";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

async function addSlugsToGroupPricing() {
  try {
    // Use MONGODB_URI instead of MONGO_URI
    const mongoUri =
      process.env.MONGODB_URI || "mongodb://localhost:27017/iicpa";

    console.log("🔗 Connecting to MongoDB...");
    console.log("📍 Database URI:", mongoUri.replace(/\/\/.*@/, "//***:***@")); // Hide credentials in logs

    await mongoose.connect(mongoUri);
    console.log("✅ Connected to MongoDB successfully");

    // First, let's check what we're working with
    const totalRecords = await GroupPricing.countDocuments({});
    console.log(`📊 Total group pricing records: ${totalRecords}`);

    const recordsWithoutSlugs = await GroupPricing.find({
      slug: { $exists: false },
    });
    const recordsWithEmptySlugs = await GroupPricing.find({ slug: "" });
    const recordsWithNullSlugs = await GroupPricing.find({ slug: null });

    const recordsNeedingSlugs = [
      ...recordsWithoutSlugs,
      ...recordsWithEmptySlugs,
      ...recordsWithNullSlugs,
    ];

    console.log(`🔍 Records needing slugs: ${recordsNeedingSlugs.length}`);

    if (recordsNeedingSlugs.length === 0) {
      console.log("🎉 All records already have slugs! No migration needed.");
      await mongoose.disconnect();
      process.exit(0);
    }

    // Show what we're about to update
    console.log("\n📋 Records to be updated:");
    recordsNeedingSlugs.forEach((record, index) => {
      console.log(`${index + 1}. "${record.groupName}" (ID: ${record._id})`);
    });

    let updatedCount = 0;
    let skippedCount = 0;

    console.log("\n🚀 Starting migration...");

    for (const record of recordsNeedingSlugs) {
      if (!record.groupName) {
        console.log(
          `⚠️  Skipped record ${record._id}: No groupName to generate slug from`
        );
        skippedCount++;
        continue;
      }

      const oldSlug = record.slug;
      const newSlug = record.groupName
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
        .replace(/\s+/g, "-") // Replace spaces with hyphens
        .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
        .trim("-"); // Remove leading/trailing hyphens

      // Check if slug already exists for another record
      const existingRecord = await GroupPricing.findOne({
        slug: newSlug,
        _id: { $ne: record._id },
      });

      if (existingRecord) {
        console.log(
          `⚠️  Skipped "${record.groupName}": Slug "${newSlug}" already exists for another record`
        );
        skippedCount++;
        continue;
      }

      record.slug = newSlug;
      await record.save();
      console.log(`✅ Updated: "${record.groupName}" -> slug: "${newSlug}"`);
      updatedCount++;
    }

    console.log(`\n📈 Migration Summary:`);
    console.log(`   ✅ Updated: ${updatedCount} records`);
    console.log(`   ⚠️  Skipped: ${skippedCount} records`);
    console.log(
      `   📊 Total processed: ${updatedCount + skippedCount} records`
    );

    // Verify the migration
    console.log("\n🔍 Verifying migration...");
    const remainingRecordsWithoutSlugs = await GroupPricing.countDocuments({
      $or: [{ slug: { $exists: false } }, { slug: "" }, { slug: null }],
    });

    if (remainingRecordsWithoutSlugs === 0) {
      console.log(
        "🎉 Migration verification successful! All records now have slugs."
      );
    } else {
      console.log(
        `⚠️  Warning: ${remainingRecordsWithoutSlugs} records still don't have slugs.`
      );
    }

    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
    process.exit(0);
  } catch (error) {
    console.error("❌ Migration failed:", error);
    console.error("Stack trace:", error.stack);
    process.exit(1);
  }
}

// Add safety check for production
if (process.env.NODE_ENV === "production") {
  console.log("⚠️  PRODUCTION ENVIRONMENT DETECTED");
  console.log("This script will modify production data.");
  console.log("Make sure you have a backup before proceeding.");

  // In production, you might want to add additional safety checks
  // For example, requiring a specific environment variable to proceed
  if (!process.env.ALLOW_PRODUCTION_MIGRATION) {
    console.log("❌ Set ALLOW_PRODUCTION_MIGRATION=true to run in production");
    process.exit(1);
  }
}

addSlugsToGroupPricing();
