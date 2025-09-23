import mongoose from "mongoose";

const emailCampaignSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    subject: {
      type: String,
      required: true,
      trim: true
    },
    content: {
      type: String,
      required: true
    },
    htmlContent: {
      type: String,
      required: true
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      required: true
    },
    status: {
      type: String,
      enum: ["draft", "scheduled", "sending", "sent", "failed"],
      default: "draft"
    },
    scheduledAt: {
      type: Date
    },
    sentAt: {
      type: Date
    },
    targetAudience: {
      type: String,
      enum: ["all", "active", "recent", "custom"],
      default: "all"
    },
    customFilters: {
      status: [String],
      source: [String],
      tags: [String],
      subscribedAfter: Date,
      subscribedBefore: Date
    },
    recipients: [{
      email: String,
      name: String,
      status: {
        type: String,
        enum: ["pending", "sent", "delivered", "opened", "clicked", "bounced", "failed"],
        default: "pending"
      },
      sentAt: Date,
      deliveredAt: Date,
      openedAt: Date,
      clickedAt: Date,
      bouncedAt: Date,
      errorMessage: String,
      trackingId: String
    }],
    stats: {
      totalRecipients: { type: Number, default: 0 },
      sent: { type: Number, default: 0 },
      delivered: { type: Number, default: 0 },
      opened: { type: Number, default: 0 },
      clicked: { type: Number, default: 0 },
      bounced: { type: Number, default: 0 },
      failed: { type: Number, default: 0 }
    },
    template: {
      type: String,
      enum: ["newsletter", "announcement", "promotion", "custom"],
      default: "newsletter"
    },
    unsubscribeUrl: String,
    trackingPixel: String,
    clickTracking: [{
      url: String,
      clicks: { type: Number, default: 0 }
    }]
  },
  { 
    timestamps: true 
  }
);

// Indexes for better performance
emailCampaignSchema.index({ status: 1 });
emailCampaignSchema.index({ sentAt: -1 });
emailCampaignSchema.index({ "recipients.email": 1 });
emailCampaignSchema.index({ "recipients.trackingId": 1 });

const EmailCampaign = mongoose.model("EmailCampaign", emailCampaignSchema);

export default EmailCampaign;
