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

// Find and fix the problematic footer
const findAndFixProblematicFooter = async () => {
  try {
    console.log("🔍 Finding the problematic footer...");

    const db = mongoose.connection.db;
    const footersCollection = db.collection("footers");

    // Find footer with company name 'sss'
    const problematicFooter = await footersCollection.findOne({
      "companyInfo.name": "sss",
    });
    if (problematicFooter) {
      console.log("🎯 Found problematic footer:", problematicFooter._id);
      console.log("📊 Company:", problematicFooter.companyInfo.name);
      console.log(
        "📋 Footer Links Keys:",
        Object.keys(problematicFooter.footerLinks)
      );

      // Update this footer with correct data
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
        { _id: problematicFooter._id },
        { $set: updateData }
      );

      console.log("✅ Updated problematic footer successfully");

      // Verify the update
      const updatedFooter = await footersCollection.findOne({
        _id: problematicFooter._id,
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
    } else {
      console.log("❌ No problematic footer found");
    }
  } catch (error) {
    console.error("❌ Error:", error);
  }
};

// Run the fix
const runFix = async () => {
  await connectDB();
  await findAndFixProblematicFooter();
  await mongoose.disconnect();
  console.log("👋 Disconnected from MongoDB");
};

runFix();
