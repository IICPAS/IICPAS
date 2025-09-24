import mongoose from "mongoose";

const contactFormSchema = new mongoose.Schema(
  {
    // Header content
    smallText: {
      type: String,
      required: true,
      default: "🎓 Get In Touch",
    },
    mainHeading: {
      type: String,
      required: true,
      default: "We're Here To Help And Ready To Hear From You",
    },
    
    // Form fields configuration
    formFields: {
      nameField: {
        placeholder: { type: String, default: "Enter your name" },
        required: { type: Boolean, default: true },
        visible: { type: Boolean, default: true },
      },
      emailField: {
        placeholder: { type: String, default: "Enter your email" },
        required: { type: Boolean, default: true },
        visible: { type: Boolean, default: true },
      },
      phoneField: {
        placeholder: { type: String, default: "Write about your phone" },
        required: { type: Boolean, default: true },
        visible: { type: Boolean, default: true },
      },
      messageField: {
        placeholder: { type: String, default: "Write Your Message" },
        required: { type: Boolean, default: true },
        visible: { type: Boolean, default: true },
        rows: { type: Number, default: 5 },
      },
    },
    
    // Button configuration
    submitButton: {
      text: { type: String, default: "Submit" },
      icon: { type: String, default: "FaPaperPlane" },
      color: { type: String, default: "bg-green-500 hover:bg-green-600" },
    },
    
    // Success/Error messages
    messages: {
      successMessage: { type: String, default: "Message sent successfully!" },
      errorMessage: { type: String, default: "Submission failed" },
    },
    
    // Styling
    colors: {
      smallText: { type: String, default: "text-green-600" },
      mainHeading: { type: String, default: "text-slate-900" },
      buttonText: { type: String, default: "text-white" },
    },
    
    // Image configuration
    image: {
      url: { type: String, default: "/images/contact-section.jpg" },
      alt: { type: String, default: "Contact Support" },
    },
    
    // Status
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Add index for better query performance
contactFormSchema.index({ isActive: 1 });

const ContactForm = mongoose.model("ContactForm", contactFormSchema);
export default ContactForm;
