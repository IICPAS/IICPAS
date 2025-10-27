import GroupPricing from "../models/GroupPricing.js";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

async function addSlugsToGroupPricing() {
  try {
    // Use MONGODB_URI instead of MONGO_URI
    const mongoUri =
      process.env.MONGODB_URI || "mongodb://localhost:27017/iicpa";
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB");

    const records = await GroupPricing.find({});
    console.log(`Found ${records.length} group pricing records`);

    let updatedCount = 0;

    for (const record of records) {
      if (!record.slug && record.groupName) {
        const oldSlug = record.slug;
        record.slug = record.groupName
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
          .replace(/\s+/g, "-") // Replace spaces with hyphens
          .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
          .trim("-"); // Remove leading/trailing hyphens

        await record.save();
        console.log(`Updated: "${record.groupName}" -> slug: "${record.slug}"`);
        updatedCount++;
      } else if (record.slug) {
        console.log(
          `Skipped: "${record.groupName}" already has slug: "${record.slug}"`
        );
      } else {
        console.log(
          `Skipped: "${record.groupName}" - no groupName to generate slug from`
        );
      }
    }

    console.log(`\nMigration complete! Updated ${updatedCount} records.`);
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

addSlugsToGroupPricing();
