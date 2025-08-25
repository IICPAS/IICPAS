import mongoose from "mongoose";
import Guide from "../models/Guide.js";
import dotenv from "dotenv";

dotenv.config();

const addSampleGuides = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Sample guides data based on the image
    const sampleGuides = [
      {
        title: "Student Brochure (All)",
        description: "Comprehensive student brochure for all programs",
        category: "marketing",
        type: "document",
        icon: "document",
        fileUrl: "https://example.com/student-brochure.pdf",
        actionButtons: [
          { label: "Download", action: "download", url: "https://example.com/student-brochure.pdf", icon: "download" }
        ],
        order: 1
      },
      {
        title: "Design Templates",
        description: "Professional design templates for marketing materials",
        category: "marketing",
        type: "template",
        icon: "external",
        externalUrl: "https://example.com/design-templates",
        actionButtons: [
          { label: "Download", action: "download", url: "https://example.com/design-templates.zip", icon: "download" },
          { label: "Extras", action: "visit", url: "https://example.com/design-extras", icon: "external" }
        ],
        order: 2
      },
      {
        title: "Video Templates",
        description: "Video templates for promotional content",
        category: "marketing",
        type: "video",
        icon: "video",
        externalUrl: "https://example.com/video-templates",
        actionButtons: [
          { label: "View", action: "view", url: "https://example.com/video-templates", icon: "play" }
        ],
        order: 3
      },
      {
        title: "Digital Marketing Guide",
        description: "Complete guide to digital marketing strategies",
        category: "marketing",
        type: "document",
        icon: "document",
        fileUrl: "https://example.com/digital-marketing-guide.pdf",
        actionButtons: [
          { label: "Basic (Meta)", action: "download", url: "https://example.com/meta-basic.pdf", icon: "download" },
          { label: "Advanced (Meta)", action: "download", url: "https://example.com/meta-advanced.pdf", icon: "download" },
          { label: "Google Ads Guide", action: "download", url: "https://example.com/google-ads-guide.pdf", icon: "download" }
        ],
        order: 4
      },
      {
        title: "Editing & Marketing Training",
        description: "Training videos for editing and marketing skills",
        category: "marketing",
        type: "training",
        icon: "play",
        externalUrl: "https://youtube.com/playlist?list=example",
        actionButtons: [
          { label: "Watch on YouTube", action: "watch", url: "https://youtube.com/playlist?list=example", icon: "play" }
        ],
        order: 5
      },
      {
        title: "Online Photo Editor",
        description: "Professional online photo editing tool",
        category: "marketing",
        type: "link",
        icon: "external",
        externalUrl: "https://example.com/photo-editor",
        actionButtons: [
          { label: "Start", action: "start", url: "https://example.com/photo-editor", icon: "external" }
        ],
        order: 6
      },
      {
        title: "Admin Kit",
        description: "Complete administrative toolkit and resources",
        category: "counselling",
        type: "document",
        icon: "document",
        fileUrl: "https://example.com/admin-kit.pdf",
        actionButtons: [
          { label: "View", action: "view", url: "https://example.com/admin-kit.pdf", icon: "download" }
        ],
        order: 7
      },
      {
        title: "Script for Counselling",
        description: "Professional counselling scripts and guidelines",
        category: "counselling",
        type: "document",
        icon: "document",
        fileUrl: "https://example.com/counselling-script.pdf",
        actionButtons: [
          { label: "View", action: "view", url: "https://example.com/counselling-script.pdf", icon: "download" }
        ],
        order: 8
      },
      {
        title: "Price List",
        description: "Current pricing for all programs and services",
        category: "counselling",
        type: "document",
        icon: "document",
        fileUrl: "https://example.com/price-list.pdf",
        actionButtons: [
          { label: "View", action: "view", url: "https://example.com/price-list.pdf", icon: "download" }
        ],
        order: 9
      },
      {
        title: "Training Videos",
        description: "Comprehensive training videos for staff",
        category: "counselling",
        type: "video",
        icon: "video",
        externalUrl: "https://example.com/training-videos",
        actionButtons: [
          { label: "Watch", action: "watch", url: "https://example.com/training-videos", icon: "play" }
        ],
        order: 10
      },
      {
        title: "Lead Conversion Chart",
        description: "Chart showing lead conversion metrics and strategies",
        category: "counselling",
        type: "document",
        icon: "document",
        externalUrl: "https://example.com/lead-conversion-chart",
        actionButtons: [
          { label: "Visit", action: "visit", url: "https://example.com/lead-conversion-chart", icon: "external" }
        ],
        order: 11
      }
    ];

    // Clear existing guides
    await Guide.deleteMany({});
    console.log("Cleared existing guides");

    // Insert sample guides
    const insertedGuides = await Guide.insertMany(sampleGuides);
    console.log(`Successfully added ${insertedGuides.length} sample guides`);

    // Display the guides
    console.log("\nSample guides added:");
    insertedGuides.forEach(guide => {
      console.log(`- ${guide.title} (${guide.category})`);
    });

  } catch (error) {
    console.error("Error adding sample guides:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
};

// Run the script
addSampleGuides();
