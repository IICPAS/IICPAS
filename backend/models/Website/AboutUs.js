import mongoose from "mongoose";

const AboutUsSchema = new mongoose.Schema({
  // Hero Section
  hero: {
    title: {
      type: String,
      default: "About Us"
    },
    breadcrumb: {
      type: String,
      default: "Home // About Us"
    }
  },

  // Main Content Section
  mainContent: {
    badge: {
      type: String,
      default: "📘 About Us"
    },
    title: {
      type: String,
      default: "Behind The Scenes: Discover The People & Passion"
    },
    description: {
      type: String,
      default: "Meet the talented individuals who bring our vision to life every day. With a shared passion and commitment, our team works tirelessly to deliver exceptional quality and innovation."
    }
  },

  // Images
  images: {
    mainImage: {
      url: {
        type: String,
        default: "/images/girl-yellow.jpg"
      },
      alt: {
        type: String,
        default: "Student 1"
      }
    },
    secondaryImage: {
      url: {
        type: String,
        default: "/images/boy-color.jpg"
      },
      alt: {
        type: String,
        default: "Student 2"
      }
    }
  },

  // Experience Badge
  experienceBadge: {
    icon: {
      type: String,
      default: "💡"
    },
    years: {
      type: String,
      default: "25+"
    },
    text: {
      type: String,
      default: "Years of experience"
    }
  },

  // Mission and Vision
  mission: {
    title: {
      type: String,
      default: "It provides tools for course creation"
    },
    description: {
      type: String,
      default: "Enrollment management, and tracking learner progress, ensuring a streamlined learning experience."
    }
  },

  vision: {
    title: {
      type: String,
      default: "Our vision is to reshape education globally"
    },
    description: {
      type: String,
      default: "Empowering students with quality learning through personalized technology-driven platforms."
    }
  },

  // Styling
  colors: {
    primary: {
      type: String,
      default: "text-green-600"
    },
    secondary: {
      type: String,
      default: "text-gray-600"
    },
    accent: {
      type: String,
      default: "bg-green-600"
    }
  },

  // Status
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export default mongoose.model("AboutUs", AboutUsSchema);
