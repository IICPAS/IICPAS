import mongoose from "mongoose";

const contactInfoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      required: true,
      enum: ["FaMapMarkerAlt", "FaPhoneAlt", "FaEnvelope", "FaClock"],
      default: "FaMapMarkerAlt",
    },
    bg: {
      type: String,
      required: true,
      default: "from-purple-100 to-white",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Add index for better query performance
contactInfoSchema.index({ isActive: 1, order: 1 });

const ContactInfo = mongoose.model("ContactInfo", contactInfoSchema);
export default ContactInfo;
