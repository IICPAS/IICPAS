import mongoose from "mongoose";

const studyMaterialSchema = new mongoose.Schema(
  {
    // Hero section
    hero: {
      title: {
        type: String,
        required: true,
        default: "Study Materials"
      },
      subtitle: {
        type: String,
        required: true,
        default: "Access comprehensive study materials, notes, and resources to excel in your finance and accounting journey."
      },
      button1: {
        text: {
          type: String,
          required: true,
          default: "Browse Materials"
        },
        link: {
          type: String,
          required: true,
          default: "#materials"
        }
      },
      button2: {
        text: {
          type: String,
          required: true,
          default: "Download Resources"
        },
        link: {
          type: String,
          required: true,
          default: "#download"
        }
      },
      backgroundGradient: {
        from: { type: String, default: "from-teal-200" },
        via: { type: String, default: "via-white" },
        to: { type: String, default: "to-blue-200" }
      },
      textColor: { type: String, default: "text-gray-800" }
    },

    // Main section
    mainSection: {
      title: {
        type: String,
        required: true,
        default: "Comprehensive Study Resources"
      },
      subtitle: {
        type: String,
        required: true,
        default: "Everything you need to succeed in your finance and accounting studies, all in one place."
      },
      ctaTitle: {
        type: String,
        required: true,
        default: "Ready to Start Learning?"
      },
      ctaDescription: {
        type: String,
        required: true,
        default: "Join thousands of students who have successfully completed their finance and accounting journey with our comprehensive study materials."
      },
      ctaButton1: {
        text: {
          type: String,
          required: true,
          default: "Get Started Today"
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
          default: "View Sample Materials"
        },
        link: {
          type: String,
          required: true,
          default: "#samples"
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
        default: "Study Materials - IICPA Institute"
      },
      description: {
        type: String,
        default: "Access comprehensive study materials, notes, and resources for finance and accounting courses at IICPA Institute."
      },
      keywords: {
        type: String,
        default: "study materials, finance, accounting, notes, resources, IICPA"
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
studyMaterialSchema.pre('save', function(next) {
  if (this.isNew && (!this.materials || this.materials.length === 0)) {
    this.materials = [
      {
        icon: "FaBook",
        title: "Course Notes",
        description: "Detailed notes covering all major topics in finance, accounting, taxation, and auditing.",
        feature: "Available for all courses",
        link: "#notes"
      },
      {
        icon: "FaPlay",
        title: "Video Lectures",
        description: "High-quality video content with expert instructors explaining complex concepts.",
        feature: "HD Quality Videos",
        link: "#videos"
      },
      {
        icon: "FaCalculator",
        title: "Practice Problems",
        description: "Extensive collection of practice problems with step-by-step solutions.",
        feature: "1000+ Problems",
        link: "#problems"
      },
      {
        icon: "FaFileAlt",
        title: "Reference Books",
        description: "Curated list of recommended textbooks and reference materials.",
        feature: "Expert Recommended",
        link: "#books"
      },
      {
        icon: "FaChartLine",
        title: "Case Studies",
        description: "Real-world case studies to apply theoretical knowledge in practical scenarios.",
        feature: "Industry Cases",
        link: "#cases"
      },
      {
        icon: "FaClipboardList",
        title: "Formula Sheets",
        description: "Quick reference guides with all important formulas and calculations.",
        feature: "Quick Reference",
        link: "#formulas"
      }
    ];
  }
  next();
});

const StudyMaterial = mongoose.model("StudyMaterial", studyMaterialSchema);
export default StudyMaterial;
