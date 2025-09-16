import mongoose from "mongoose";

const whyIICPAchema = new mongoose.Schema(
  {
    // Main content
    title: {
      type: String,
      required: true,
      default: "Empowering Your Future with Excellence"
    },
    
    subtitle: {
      type: String,
      required: true,
      default: "Why Choose IICPA"
    },
    
    description: {
      type: String,
      required: true,
      default: "IICPA Institute stands as a beacon of educational excellence, offering cutting-edge courses designed to transform your career aspirations into reality. Our comprehensive curriculum, expert instructors, and industry-aligned programs ensure you receive world-class education that prepares you for the dynamic professional landscape."
    },
    
    // Image settings
    image: {
      type: String,
      required: true,
      default: "/images/img1.jpg"
    },
    
    // Statistics
    statistics: {
      courses: {
        number: { type: String, default: "50+" },
        label: { type: String, default: "Courses" },
        description: { type: String, default: "Comprehensive courses covering accounting, finance, and professional development" }
      },
      students: {
        number: { type: String, default: "10K+" },
        label: { type: String, default: "Students" },
        description: { type: String, default: "Successful graduates building successful careers across industries" }
      },
      successRate: {
        number: { type: String, default: "98%" },
        label: { type: String, default: "Success Rate" }
      }
    },
    
    // Features list
    features: [{
      type: String,
      default: [
        "Industry-Expert Instructors",
        "Flexible Learning Schedule", 
        "Practical Hands-on Training",
        "Career Placement Support"
      ]
    }],
    
    // Button settings
    buttons: {
      exploreCourses: {
        text: { type: String, default: "Explore Our Courses" },
        link: { type: String, default: "/courses" }
      },
      learnMore: {
        text: { type: String, default: "Learn More About IICPA" },
        link: { type: String, default: "/about" }
      }
    },
    
    // Color scheme
    colors: {
      title: { type: String, default: "text-white" },
      subtitle: { type: String, default: "text-green-400" },
      description: { type: String, default: "text-white/70" },
      background: { type: String, default: "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" }
    },
    
    // Status
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

const WhyIICPA = mongoose.model("WhyIICPA", whyIICPAchema);
export default WhyIICPA;
