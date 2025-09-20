import mongoose from "mongoose";

const demoDigitalHubSchema = new mongoose.Schema(
  {
    // Hero section
    hero: {
      title: {
        type: String,
        required: true,
        default: "Demo Digital Hub"
      },
      subtitle: {
        type: String,
        required: true,
        default: "Explore our comprehensive course demos and get a preview of what you'll learn in our finance and accounting programs."
      },
      button1: {
        text: {
          type: String,
          required: true,
          default: "Browse Demos"
        },
        link: {
          type: String,
          required: true,
          default: "#demos"
        }
      },
      button2: {
        text: {
          type: String,
          required: true,
          default: "Try Free Samples"
        },
        link: {
          type: String,
          required: true,
          default: "#samples"
        }
      },
      backgroundGradient: {
        from: { type: String, default: "from-[#afffe8]" },
        via: { type: String, default: "via-white" },
        to: { type: String, default: "to-[#b8e6ff]" }
      },
      textColor: { type: String, default: "text-gray-800" }
    },

    // Main section
    mainSection: {
      title: {
        type: String,
        required: true,
        default: "Interactive Course Demos"
      },
      subtitle: {
        type: String,
        required: true,
        default: "Experience our courses firsthand with interactive demos, sample lessons, and preview content designed to showcase our teaching methodology."
      },
      ctaTitle: {
        type: String,
        required: true,
        default: "Ready to Experience Our Courses?"
      },
      ctaDescription: {
        type: String,
        required: true,
        default: "Join thousands of students who have discovered their potential through our comprehensive finance and accounting programs."
      },
      ctaButton1: {
        text: {
          type: String,
          required: true,
          default: "Start Free Trial"
        },
        link: {
          type: String,
          required: true,
          default: "/student-login"
        }
      },
      ctaButton2: {
        text: {
          type: String,
          required: true,
          default: "View Course Catalog"
        },
        link: {
          type: String,
          required: true,
          default: "/course"
        }
      }
    },

    // Materials array
    materials: [{
      icon: {
        type: String,
        required: true
      },
      title: {
        type: String,
        required: true
      },
      description: {
        type: String,
        required: true
      },
      feature: {
        type: String,
        required: true
      },
      link: {
        type: String,
        default: "#"
      },
      isActive: {
        type: Boolean,
        default: true
      }
    }],

    // SEO
    seo: {
      title: {
        type: String,
        default: "Demo Digital Hub - IICPA Institute"
      },
      description: {
        type: String,
        default: "Explore interactive course demos and preview content for finance and accounting programs at IICPA Institute."
      },
      keywords: {
        type: String,
        default: "demo, course preview, finance, accounting, interactive, IICPA"
      }
    },

    // Status
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

// Set default materials
demoDigitalHubSchema.pre('save', function(next) {
  if (this.isNew && (!this.materials || this.materials.length === 0)) {
    this.materials = [
      {
        icon: "FaPlayCircle",
        title: "Video Demo Lessons",
        description: "Watch sample video lessons from our expert instructors covering key concepts in finance and accounting.",
        feature: "HD Quality Videos",
        link: "#video-demos"
      },
      {
        icon: "FaBookOpen",
        title: "Interactive Course Previews",
        description: "Explore interactive course modules and get a feel for our comprehensive curriculum structure.",
        feature: "Interactive Content",
        link: "#course-preview"
      },
      {
        icon: "FaCalculator",
        title: "Practice Problem Demos",
        description: "Try sample practice problems with step-by-step solutions to understand our teaching approach.",
        feature: "Step-by-Step Solutions",
        link: "#practice-demos"
      },
      {
        icon: "FaChartBar",
        title: "Case Study Samples",
        description: "Review real-world case studies and see how we apply theoretical knowledge to practical scenarios.",
        feature: "Real Industry Cases",
        link: "#case-studies"
      },
      {
        icon: "FaFileAlt",
        title: "Sample Study Materials",
        description: "Download sample notes, formula sheets, and reference materials to see the quality of our content.",
        feature: "High-Quality Materials",
        link: "#sample-materials"
      },
      {
        icon: "FaVideo",
        title: "Live Session Previews",
        description: "Experience snippets from our live interactive sessions and Q&A discussions.",
        feature: "Live Interaction",
        link: "#live-previews"
      }
    ];
  }
  next();
});

const DemoDigitalHub = mongoose.model("DemoDigitalHub", demoDigitalHubSchema);
export default DemoDigitalHub;
