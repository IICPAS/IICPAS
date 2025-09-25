const mongoose = require("mongoose");

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

// Migration function to update existing footer data
const migrateFooterData = async () => {
  try {
    console.log("🔄 Starting footer data migration...");

    // Define the footer schema inline for migration
    const footerSchema = new mongoose.Schema(
      {
        companyInfo: {
          name: String,
          tagline: String,
          contact: {
            phone: String,
            email: String,
            address: String,
          },
        },
        footerLinks: {
          companyPolicies: [
            {
              name: String,
              href: String,
            },
          ],
          generalLinks: [
            {
              name: String,
              href: String,
            },
          ],
        },
        socialLinks: [
          {
            platform: String,
            href: String,
            icon: String,
          },
        ],
        bottomBar: {
          copyright: String,
          legalLinks: [
            {
              name: String,
              href: String,
            },
          ],
        },
        colors: {
          background: String,
          accent: String,
          text: String,
          textSecondary: String,
        },
        isActive: Boolean,
      },
      { timestamps: true }
    );

    const Footer = mongoose.model("Footer", footerSchema);

    // Find all existing footer entries
    const existingFooters = await Footer.find({});
    console.log(`📊 Found ${existingFooters.length} existing footer entries`);

    for (const footer of existingFooters) {
      console.log(`🔄 Migrating footer entry: ${footer._id}`);

      // Check if it already has the new structure
      if (
        footer.footerLinks &&
        footer.footerLinks.companyPolicies &&
        footer.footerLinks.generalLinks
      ) {
        console.log("⏭️  Footer already has new structure, skipping...");
        continue;
      }

      // Migrate old structure to new structure
      const migratedFooter = {
        ...footer.toObject(),
        footerLinks: {
          companyPolicies: [
            { name: "Privacy Policy", href: "/privacy" },
            { name: "Refund Policy", href: "/refund" },
            { name: "Terms & Conditions", href: "/terms" },
            { name: "Return Policy", href: "/return" },
          ],
          generalLinks: [
            { name: "About Us", href: "/about" },
            { name: "Courses", href: "/courses" },
            { name: "Blog", href: "/blog" },
            { name: "Contact Us", href: "/contact" },
            { name: "FAQ", href: "/faq" },
            { name: "Help Center", href: "/help" },
          ],
        },
      };

      // Update the footer entry
      await Footer.findByIdAndUpdate(footer._id, migratedFooter);
      console.log("✅ Migrated footer entry successfully");
    }

    console.log("🎉 Footer migration completed successfully!");
  } catch (error) {
    console.error("❌ Migration error:", error);
  }
};

// Run migration
const runMigration = async () => {
  await connectDB();
  await migrateFooterData();
  await mongoose.disconnect();
  console.log("👋 Disconnected from MongoDB");
};

runMigration();
