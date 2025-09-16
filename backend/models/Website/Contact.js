import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    // Main content
    title: {
      type: String,
      required: true,
      default: "Contact Us"
    },
    
    subtitle: {
      type: String,
      required: true,
      default: "Let's Get in Touch"
    },
    
    description: {
      type: String,
      required: true,
      default: "Ready to start your learning journey? Get in touch with us today!"
    },
    
    // Contact information
    contactInfo: {
      phone: {
        number: { type: String, required: true, default: "+91 98765 43210" },
        label: { type: String, required: true, default: "Phone" }
      },
      email: {
        address: { type: String, required: true, default: "support@iicpa.org" },
        label: { type: String, required: true, default: "Email" }
      },
      address: {
        text: { type: String, required: true, default: "123 Knowledge Park, New Delhi, India" },
        label: { type: String, required: true, default: "Address" }
      }
    },
    
    // Form settings
    form: {
      buttonText: {
        type: String,
        required: true,
        default: "Send Message"
      },
      successMessage: {
        type: String,
        required: true,
        default: "Message sent successfully!"
      },
      errorMessage: {
        type: String,
        required: true,
        default: "Something went wrong. Please try again."
      }
    },
    
    // Color scheme
    colors: {
      title: { type: String, default: "text-green-600" },
      subtitle: { type: String, default: "text-gray-900" },
      description: { type: String, default: "text-gray-600" },
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

const WebsiteContact = mongoose.model("WebsiteContact", contactSchema);
export default WebsiteContact;
