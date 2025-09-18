import mongoose from "mongoose";

const newsletterSubscriptionSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    name: {
      type: String,
      trim: true
    },
    phone: {
      type: String,
      trim: true
    },
    source: {
      type: String,
      default: "newsletter",
      enum: ["newsletter", "contact", "course", "other"]
    },
    status: {
      type: String,
      enum: ["active", "unsubscribed", "bounced"],
      default: "active"
    },
    subscribedAt: {
      type: Date,
      default: Date.now
    },
    unsubscribedAt: {
      type: Date
    },
    ipAddress: {
      type: String
    },
    userAgent: {
      type: String
    },
    tags: [{
      type: String
    }],
    notes: {
      type: String
    }
  },
  { 
    timestamps: true 
  }
);

// Index for faster queries
newsletterSubscriptionSchema.index({ email: 1 });
newsletterSubscriptionSchema.index({ status: 1 });
newsletterSubscriptionSchema.index({ subscribedAt: -1 });

const NewsletterSubscription = mongoose.model("NewsletterSubscription", newsletterSubscriptionSchema);
export default NewsletterSubscription;
