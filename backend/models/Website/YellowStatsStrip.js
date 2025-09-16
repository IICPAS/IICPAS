import mongoose from "mongoose";

const yellowStatsStripSchema = new mongoose.Schema(
  {
    // Main content
    title: {
      type: String,
      required: true,
      default: "Our Achievements"
    },
    
    // Statistics
    statistics: [{
      icon: {
        type: String,
        required: true,
        default: "FaGraduationCap"
      },
      number: {
        type: String,
        required: true,
        default: "120K+"
      },
      label: {
        type: String,
        required: true,
        default: "Successfully Student"
      },
      color: {
        type: String,
        required: true,
        default: "from-blue-500 to-cyan-500"
      },
      bgColor: {
        type: String,
        required: true,
        default: "from-blue-600/20 to-cyan-600/20"
      }
    }],
    
    // Color scheme
    colors: {
      title: { type: String, default: "text-white" },
      accent: { type: String, default: "text-[#3cd664]" },
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

// Set default statistics
yellowStatsStripSchema.pre('save', function(next) {
  if (this.isNew && (!this.statistics || this.statistics.length === 0)) {
    this.statistics = [
      {
        icon: "FaGraduationCap",
        number: "120K+",
        label: "Successfully Student",
        color: "from-blue-500 to-cyan-500",
        bgColor: "from-blue-600/20 to-cyan-600/20"
      },
      {
        icon: "FaClipboardCheck",
        number: "560K+",
        label: "Courses Completed",
        color: "from-green-500 to-emerald-500",
        bgColor: "from-green-600/20 to-emerald-600/20"
      },
      {
        icon: "FaBookOpen",
        number: "3M+",
        label: "Satisfied Review",
        color: "from-purple-500 to-pink-500",
        bgColor: "from-purple-600/20 to-pink-600/20"
      },
      {
        icon: "FaTrophy",
        number: "120K+",
        label: "Successfully Student",
        color: "from-orange-500 to-red-500",
        bgColor: "from-orange-600/20 to-red-600/20"
      }
    ];
  }
  next();
});

const YellowStatsStrip = mongoose.model("YellowStatsStrip", yellowStatsStripSchema);
export default YellowStatsStrip;
