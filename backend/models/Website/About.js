import mongoose from "mongoose";

const aboutSchema = new mongoose.Schema(
  {
    // Main content
    title: {
      type: String,
      required: true,
      default: "About Us"
    },
    
    content: {
      type: String,
      required: true,
      default: "Welcome to IICPA Institute, where excellence in education meets innovation in learning."
    },
    
    // Images
    mainImage: {
      type: String,
      required: true,
      default: "/images/about.jpeg"
    },
    
    testimonialImage: {
      type: String,
      required: true,
      default: "/images/young-woman.jpg"
    },
    
    // Video settings
    video: {
      type: {
        type: String,
        enum: ['file', 'url'],
        default: 'file'
      },
      url: {
        type: String,
        default: "/videos/aboutus.mp4"
      },
      poster: {
        type: String,
        default: "/images/video-poster.jpg"
      },
      autoplay: {
        type: Boolean,
        default: true
      },
      loop: {
        type: Boolean,
        default: true
      },
      muted: {
        type: Boolean,
        default: true
      }
    },
    
    // Testimonial content
    testimonial: {
      text: {
        type: String,
        required: true,
        default: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout."
      },
      author: {
        type: String,
        required: true,
        default: "Alisa Oliva"
      },
      position: {
        type: String,
        required: true,
        default: "Web Designer"
      }
    },
    
    // Class schedule
    classSchedule: {
      title: {
        type: String,
        required: true,
        default: "Our Class Day"
      },
      days: [{
        day: { type: String, required: true },
        time: { type: String, required: true }
      }]
    },
    
    // Button settings
    button: {
      text: {
        type: String,
        required: true,
        default: "Learn More About Us"
      },
      link: {
        type: String,
        required: true,
        default: "/about"
      }
    },
    
    // Color scheme
    colors: {
      title: { type: String, default: "text-green-600" },
      content: { type: String, default: "text-gray-700" },
      background: { type: String, default: "bg-white" }
    },
    
    // Status
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

// Set default class schedule
aboutSchema.pre('save', function(next) {
  if (this.isNew && (!this.classSchedule.days || this.classSchedule.days.length === 0)) {
    this.classSchedule.days = [
      { day: "Saturday", time: "10:00-16:00" },
      { day: "Sunday", time: "10:00-16:00" },
      { day: "Monday", time: "10:00-16:00" },
      { day: "Tuesday", time: "10:00-16:00" },
      { day: "Wednesday", time: "10:00-16:00" }
    ];
  }
  next();
});

const About = mongoose.model("About", aboutSchema);
export default About;
