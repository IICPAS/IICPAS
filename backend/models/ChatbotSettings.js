import mongoose from "mongoose";

const chatbotSettingsSchema = new mongoose.Schema({
  assistantName: {
    type: String,
    required: true,
    default: "Neha Singh"
  },
  profilePicture: {
    type: String,
    required: true,
    default: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face"
  },
  welcomeMessage: {
    type: String,
    required: true,
    default: "Hi! I'm your course assistant. To provide you with personalized assistance, I'll need a few details from you.\n\nLet's start with your **Full Name** please:"
  },
  status: {
    type: String,
    required: true,
    default: "Online",
    enum: ["Online", "Away", "Busy", "Offline"]
  }
}, {
  timestamps: true
});

// Ensure only one settings document exists
chatbotSettingsSchema.statics.getSettings = async function() {
  let settings = await this.findOne();
  if (!settings) {
    settings = new this();
    await settings.save();
  }
  return settings;
};

export default mongoose.model("ChatbotSettings", chatbotSettingsSchema);

