import mongoose from "mongoose";

const GuideSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  category: { 
    type: String, 
    required: true,
    enum: ["marketing", "counselling", "sales", "general"],
    default: "general"
  },
  type: { 
    type: String, 
    required: true,
    enum: ["document", "video", "template", "link", "training"],
    default: "document"
  },
  icon: { 
    type: String, 
    required: true,
    default: "document"
  },
  fileUrl: { 
    type: String 
  },
  externalUrl: { 
    type: String 
  },
  actionButtons: [{
    label: { type: String, required: true },
    action: { type: String, required: true }, // "download", "view", "watch", "visit", "start"
    url: { type: String },
    icon: { type: String }
  }],
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active"
  },
  order: {
    type: Number,
    default: 0
  },
  fileSize: {
    type: Number // in bytes
  },
  fileType: {
    type: String
  },
  downloads: {
    type: Number,
    default: 0
  },
  views: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Prevent OverwriteModelError
const Guide = mongoose.models.Guide || mongoose.model("Guide", GuideSchema);

export default Guide;
