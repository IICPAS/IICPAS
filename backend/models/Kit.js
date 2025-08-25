import mongoose from "mongoose";

const KitSchema = new mongoose.Schema({
  module: { 
    type: String, 
    required: true 
  },
  labClassroom: { 
    type: Number, 
    default: 0,
    min: 0
  },
  recorded: { 
    type: Number, 
    default: 0,
    min: 0
  },
  labPlusLive: { 
    type: Number, 
    default: 0,
    min: 0
  },
  description: { 
    type: String 
  },
  category: { 
    type: String,
    enum: ["accounting", "excel", "taxation", "gst", "office", "finance", "communication", "other"],
    default: "other"
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active"
  },
  price: {
    type: Number,
    default: 0
  },
  supplier: {
    type: String
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Prevent OverwriteModelError
const Kit = mongoose.models.Kit || mongoose.model("Kit", KitSchema);

export default Kit;
