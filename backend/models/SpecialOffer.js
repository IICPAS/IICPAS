import mongoose from "mongoose";
const { Schema, model } = mongoose;

const SpecialOfferSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500,
  },
  icon: {
    type: String,
    default: "party_pomp", // Default to party pomp icon
    enum: ["party_pomp", "gift", "star", "fire", "trophy", "diamond"],
  },
  backgroundColor: {
    type: String,
    default: "#FF6B6B", // Default red background
  },
  textColor: {
    type: String,
    default: "#FFFFFF", // Default white text
  },
  expiryDate: {
    type: Date,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  priority: {
    type: Number,
    default: 1,
    min: 1,
    max: 10,
  },
  displayLocation: {
    type: String,
    default: "admin_dashboard",
    enum: ["admin_dashboard", "public_homepage", "course_page", "all"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt field before saving
SpecialOfferSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Update the updatedAt field before updating
SpecialOfferSchema.pre("findOneAndUpdate", function (next) {
  this.set({ updatedAt: Date.now() });
  next();
});

// Virtual to check if offer is expired
SpecialOfferSchema.virtual("isExpired").get(function () {
  return new Date() > this.expiryDate;
});

// Virtual to check if offer should be displayed
SpecialOfferSchema.virtual("shouldDisplay").get(function () {
  return this.isActive && !this.isExpired;
});

// Index for efficient queries
SpecialOfferSchema.index({ expiryDate: 1, isActive: 1 });
SpecialOfferSchema.index({ displayLocation: 1, isActive: 1 });

const SpecialOffer = model("SpecialOffer", SpecialOfferSchema);
export default SpecialOffer;
