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

// Clean up and create fresh footer data
const cleanUpAndCreateFresh = async () => {
  try {
    console.log("🧹 Cleaning up footer data...");

    const db = mongoose.connection.db;
    const footersCollection = db.collection("footers");

    // Delete all existing footers
    const deleteResult = await footersCollection.deleteMany({});
    console.log(
      `🗑️  Deleted ${deleteResult.deletedCount} existing footer entries`
    );

    // Create a fresh footer with correct structure
    const newFooter = {
      companyInfo: {
        name: "IICPA Institute",
        tagline:
          "Empowering future finance professionals with world-class education, expert guidance, and industry-relevant skills for career success.",
        contact: {
          phone: "+91 98765 43210",
          email: "info@iicpa.com",
          address: "123 Education Street, Learning City, LC 12345",
        },
      },
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
      socialLinks: [
        {
          platform: "Facebook",
          href: "https://facebook.com/iicpa",
          icon: "FaFacebook",
        },
        {
          platform: "Twitter",
          href: "https://twitter.com/iicpa",
          icon: "FaTwitter",
        },
        {
          platform: "LinkedIn",
          href: "https://linkedin.com/company/iicpa",
          icon: "FaLinkedin",
        },
        {
          platform: "Instagram",
          href: "https://instagram.com/iicpa",
          icon: "FaInstagram",
        },
        {
          platform: "YouTube",
          href: "https://youtube.com/iicpa",
          icon: "FaYoutube",
        },
      ],
      bottomBar: {
        copyright: "IICPA Institute. All rights reserved.",
        legalLinks: [
          { name: "Terms of Service", href: "/terms" },
          { name: "Privacy Policy", href: "/privacy" },
          { name: "Cookie Policy", href: "/cookies" },
        ],
      },
      colors: {
        background: "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900",
        accent: "text-[#3cd664]",
        text: "text-white",
        textSecondary: "text-gray-300",
      },
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Insert the new footer
    const result = await footersCollection.insertOne(newFooter);
    console.log("✅ Created fresh footer with ID:", result.insertedId);

    // Verify
    const activeFooter = await footersCollection.findOne({ isActive: true });
    console.log(
      "📋 Active footer structure:",
      Object.keys(activeFooter.footerLinks)
    );
    console.log(
      "📄 Company Policies:",
      activeFooter.footerLinks.companyPolicies.length,
      "items"
    );
    console.log(
      "🔗 General Links:",
      activeFooter.footerLinks.generalLinks.length,
      "items"
    );
    console.log("🏢 Company Name:", activeFooter.companyInfo.name);
  } catch (error) {
    console.error("❌ Error:", error);
  }
};

// Run the cleanup
const runCleanup = async () => {
  await connectDB();
  await cleanUpAndCreateFresh();
  await mongoose.disconnect();
  console.log("👋 Disconnected from MongoDB");
};

runCleanup();
