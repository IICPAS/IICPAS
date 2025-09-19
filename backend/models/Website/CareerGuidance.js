import mongoose from "mongoose";

const careerGuidanceSchema = new mongoose.Schema(
  {
    // Hero section
    hero: {
      title: {
        type: String,
        required: true,
        default: "Career Guidance"
      },
      subtitle: {
        type: String,
        required: true,
        default: "Get expert career guidance and counseling to make informed decisions about your professional future in finance and accounting."
      },
      button1: {
        text: {
          type: String,
          required: true,
          default: "Book Consultation"
        },
        link: {
          type: String,
          required: true,
          default: "#consultation"
        }
      },
      button2: {
        text: {
          type: String,
          required: true,
          default: "Explore Career Paths"
        },
        link: {
          type: String,
          required: true,
          default: "#career-paths"
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
        default: "Comprehensive Career Services"
      },
      subtitle: {
        type: String,
        required: true,
        default: "From career planning to job placement, we provide end-to-end support for your professional journey."
      },
      ctaTitle: {
        type: String,
        required: true,
        default: "Ready to Advance Your Career?"
      },
      ctaDescription: {
        type: String,
        required: true,
        default: "Join thousands of professionals who have successfully advanced their careers with our expert guidance and support."
      },
      ctaButton1: {
        text: {
          type: String,
          required: true,
          default: "Schedule Consultation"
        },
        link: {
          type: String,
          required: true,
          default: "/contact"
        }
      },
      ctaButton2: {
        text: {
          type: String,
          required: true,
          default: "View Success Stories"
        },
        link: {
          type: String,
          required: true,
          default: "#success-stories"
        }
      }
    },

    // Services array
    services: [{
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
        default: "Career Guidance - IICPA Institute"
      },
      description: {
        type: String,
        default: "Get expert career guidance and counseling for finance and accounting professionals at IICPA Institute."
      },
      keywords: {
        type: String,
        default: "career guidance, career counseling, finance careers, accounting careers, job placement, IICPA"
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

// Set default services
careerGuidanceSchema.pre('save', function(next) {
  if (this.isNew && (!this.services || this.services.length === 0)) {
    this.services = [
      {
        icon: "FaUserTie",
        title: "Career Counseling",
        description: "One-on-one sessions with experienced career counselors to help you choose the right path.",
        feature: "Personalized Guidance",
        link: "#counseling"
      },
      {
        icon: "FaChartBar",
        title: "Industry Insights",
        description: "Stay updated with the latest trends, opportunities, and requirements in the finance industry.",
        feature: "Market Updates",
        link: "#insights"
      },
      {
        icon: "FaFileAlt",
        title: "Resume Building",
        description: "Professional resume writing services and interview preparation to land your dream job.",
        feature: "Professional Support",
        link: "#resume"
      },
      {
        icon: "FaClipboardCheck",
        title: "Skill Assessment",
        description: "Comprehensive skill assessments to identify your strengths and areas for improvement.",
        feature: "Detailed Analysis",
        link: "#assessment"
      },
      {
        icon: "FaUsers",
        title: "Networking Opportunities",
        description: "Connect with industry professionals and alumni through our networking events and platforms.",
        feature: "Industry Connections",
        link: "#networking"
      },
      {
        icon: "FaHandshake",
        title: "Job Placement Support",
        description: "Dedicated placement support with job matching, interview scheduling, and follow-up assistance.",
        feature: "End-to-End Support",
        link: "#placement"
      }
    ];
  }
  next();
});

const CareerGuidance = mongoose.model("CareerGuidance", careerGuidanceSchema);
export default CareerGuidance;
