import mongoose from "mongoose";

// Connect to the correct MongoDB database
const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/iicpas");
    console.log("✅ Connected to MongoDB (iicpas)");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
};

// Update the footer with the new structure
const updateFooterWithNewStructure = async () => {
  try {
    console.log("🔄 Updating footer with new structure...");

    const db = mongoose.connection.db;
    const footersCollection = db.collection("footers");

    // Find the active footer
    const activeFooter = await footersCollection.findOne({ isActive: true });
    if (!activeFooter) {
      console.log("❌ No active footer found");
      return;
    }

    console.log("📋 Found active footer:", activeFooter._id);
    console.log("📊 Current company:", activeFooter.companyInfo?.name);
    console.log(
      "📋 Current structure:",
      Object.keys(activeFooter.footerLinks || {})
    );

    // Update with new structure
    const updateData = {
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

    console.log("✅ Updated footer successfully");

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
    console.log("🏢 Company Name:", updatedFooter.companyInfo.name);
  } catch (error) {
    console.error("❌ Error:", error);
  }
};

// Run the update
const runUpdate = async () => {
  await connectDB();
  await updateFooterWithNewStructure();
  await mongoose.disconnect();
  console.log("👋 Disconnected from MongoDB");
};

runUpdate();
