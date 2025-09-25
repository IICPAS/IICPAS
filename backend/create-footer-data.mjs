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

// Check database collections and data
const checkDatabase = async () => {
  try {
    console.log("🔍 Checking database collections...");

    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log(
      "📊 Available collections:",
      collections.map((c) => c.name)
    );

    // Check if footers collection exists
    const footersCollection = db.collection("footers");
    const footerCount = await footersCollection.countDocuments();
    console.log(`📄 Footers collection has ${footerCount} documents`);

    if (footerCount > 0) {
      const footers = await footersCollection.find({}).toArray();
      console.log("📋 Footer documents:");
      footers.forEach((footer, index) => {
        console.log(`  ${index + 1}. ID: ${footer._id}`);
        console.log(`     Company: ${footer.companyInfo?.name || "N/A"}`);
        console.log(
          `     Footer Links Keys: ${Object.keys(footer.footerLinks || {}).join(
            ", "
          )}`
        );
        console.log(`     Active: ${footer.isActive || false}`);
      });
    }

    // Create a new footer with the correct structure
    console.log("🔄 Creating new footer with correct structure...");
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
    console.log("✅ Created new footer with ID:", result.insertedId);
  } catch (error) {
    console.error("❌ Error:", error);
  }
};

// Run the check
const runCheck = async () => {
  await connectDB();
  await checkDatabase();
  await mongoose.disconnect();
  console.log("👋 Disconnected from MongoDB");
};

runCheck();
