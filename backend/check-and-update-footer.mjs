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

// Check and update existing footer data
const checkAndUpdateFooterData = async () => {
  try {
    console.log("🔍 Checking existing footer data...");

    // Define the footer schema
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
        footerLinks: mongoose.Schema.Types.Mixed, // Allow any structure
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
      console.log(`🔄 Processing footer entry: ${footer._id}`);
      console.log(
        "Current footerLinks structure:",
        Object.keys(footer.footerLinks || {})
      );

      // Check if it has the old structure
      if (
        footer.footerLinks &&
        (footer.footerLinks.courses || footer.footerLinks.resources)
      ) {
        console.log("🔄 Found old structure, updating to new structure...");

        // Update to new structure
        const updatedFooter = {
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
        await Footer.findByIdAndUpdate(footer._id, updatedFooter);
        console.log("✅ Updated footer entry successfully");
      } else if (footer.footerLinks && footer.footerLinks.companyPolicies) {
        console.log("✅ Footer already has new structure");
      } else {
        console.log("⚠️  Footer has unexpected structure");
      }
    }

    console.log("🎉 Footer data check and update completed!");
  } catch (error) {
    console.error("❌ Error:", error);
  }
};

// Run the check and update
const runCheckAndUpdate = async () => {
  await connectDB();
  await checkAndUpdateFooterData();
  await mongoose.disconnect();
  console.log("👋 Disconnected from MongoDB");
};

runCheckAndUpdate();
