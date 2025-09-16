import mongoose from "mongoose";

const newsletterSectionSchema = new mongoose.Schema(
  {
    // Main content
    badge: {
      text: {
        type: String,
        required: true,
        default: "Stay Updated"
      },
      icon: {
        type: String,
        required: true,
        default: "FaEnvelope"
      }
    },
    
    title: {
      part1: {
        type: String,
        required: true,
        default: "Never Miss Our"
      },
      part2: {
        type: String,
        required: true,
        default: "Latest Updates"
      }
    },
    
    description: {
      type: String,
      required: true,
      default: "Get exclusive access to new courses, special offers, and educational content delivered straight to your inbox. Join thousands of learners who stay ahead."
    },
    
    features: [{
      text: { type: String, required: true },
      icon: { type: String, required: true, default: "FaCheckCircle" }
    }],
    
    form: {
      placeholder: {
        type: String,
        required: true,
        default: "Enter your email address"
      },
      buttonText: {
        type: String,
        required: true,
        default: "Subscribe"
      },
      successText: {
        type: String,
        required: true,
        default: "Done!"
      },
      buttonIcon: {
        type: String,
        required: true,
        default: "FaRocket"
      },
      successIcon: {
        type: String,
        required: true,
        default: "FaCheckCircle"
      }
    },
    
    stats: {
      rating: {
        type: String,
        required: true,
        default: "4.9/5 Rating"
      },
      subscribers: {
        type: String,
        required: true,
        default: "10,000+ Subscribers"
      }
    },
    
    image: {
      src: {
        type: String,
        required: true,
        default: "/images/student.png"
      },
      alt: {
        type: String,
        required: true,
        default: "Newsletter Student"
      }
    },
    
    // Color scheme
    colors: {
      badge: { type: String, default: "text-[#3cd664]" },
      badgeBg: { type: String, default: "bg-[#3cd664]/10" },
      title: { type: String, default: "text-gray-900" },
      titleAccent: { type: String, default: "from-[#3cd664] to-[#22c55e]" },
      description: { type: String, default: "text-gray-600" },
      background: { type: String, default: "bg-gradient-to-br from-[#f8fffe] via-[#f0fdf4] to-[#ecfdf5]" },
      button: { type: String, default: "from-[#3cd664] to-[#22c55e]" },
      buttonHover: { type: String, default: "from-[#22c55e] to-[#16a34a]" }
    },
    
    // Status
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

// Set default features
newsletterSectionSchema.pre('save', function(next) {
  if (this.isNew && (!this.features || this.features.length === 0)) {
    this.features = [
      { text: "Weekly Updates", icon: "FaCheckCircle" },
      { text: "Exclusive Content", icon: "FaCheckCircle" },
      { text: "No Spam", icon: "FaCheckCircle" }
    ];
  }
  next();
});

const NewsletterSection = mongoose.model("NewsletterSection", newsletterSectionSchema);
export default NewsletterSection;
