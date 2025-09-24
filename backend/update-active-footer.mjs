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

// Update the active footer with proper data
const updateActiveFooter = async () => {
  try {
    console.log("🔄 Updating active footer with proper data...");

    const db = mongoose.connection.db;
    const footersCollection = db.collection("footers");

    // Find the active footer
    const activeFooter = await footersCollection.findOne({ isActive: true });
    if (!activeFooter) {
      console.log("❌ No active footer found");
      return;
    }

    console.log("📋 Found active footer:", activeFooter._id);

    // Update with proper data
    const updateData = {
      ...activeFooter,
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
      bottomBar: {
        copyright: "IICPA Institute. All rights reserved.",
        legalLinks: [
          { name: "Terms of Service", href: "/terms" },
          { name: "Privacy Policy", href: "/privacy" },
          { name: "Cookie Policy", href: "/cookies" },
        ],
      },
      updatedAt: new Date(),
    };

    // Update the footer
    await footersCollection.updateOne(
      { _id: activeFooter._id },
      { $set: updateData }
    );

    console.log("✅ Updated active footer successfully");

    // Verify the update
    const updatedFooter = await footersCollection.findOne({
      _id: activeFooter._id,
    });
    console.log(
      "📊 Updated footer structure:",
      Object.keys(updatedFooter.footerLinks)
    );
    console.log(
      "📄 Company Policies:",
      updatedFooter.footerLinks.companyPolicies.length,
      "items"
    );
    console.log(
      "🔗 General Links:",
      updatedFooter.footerLinks.generalLinks.length,
      "items"
    );
  } catch (error) {
    console.error("❌ Error:", error);
  }
};

// Run the update
const runUpdate = async () => {
  await connectDB();
  await updateActiveFooter();
  await mongoose.disconnect();
  console.log("👋 Disconnected from MongoDB");
};

runUpdate();
