import mongoose from "mongoose";

const heroSchema = new mongoose.Schema(
  {
    // Main heading parts
    smallText: {
      type: String,
      required: true,
      default: "# Best Online Platform"
    },
    mainHeading: {
      part1: { type: String, required: true, default: "Start Learning" },
      part2: { type: String, required: true, default: "Today" },
      part3: { type: String, required: true, default: "Discover" },
      part4: { type: String, required: true, default: "Your Next" },
      part5: { type: String, required: true, default: "Great Skill" }
    },
    
    // Description text
    description: {
      type: String,
      required: true,
      default: "Enhance your educational journey with our cutting-edge course platform."
    },
    
    // Button text
    buttonText: {
      type: String,
      required: true,
      default: "Get Started »"
    },
    
    // Video settings
    videoUrl: {
      type: String,
      required: true,
      default: "/videos/homehero.mp4"
    },
    
    // Video file upload
    videoFile: {
      type: String, // Path to uploaded video file
      default: null
    },
    
    // Color scheme
    colors: {
      smallText: { type: String, default: "text-green-400" },
      part1: { type: String, default: "text-white" },
      part2: { type: String, default: "text-green-400" },
      part3: { type: String, default: "text-green-400" },
      part4: { type: String, default: "text-white" },
      part5: { type: String, default: "text-blue-300" },
      description: { type: String, default: "text-white/90" },
      button: { type: String, default: "bg-green-500 hover:bg-green-600" }
    },
    
    // Status
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

const Hero = mongoose.model("Hero", heroSchema);
export default Hero;
