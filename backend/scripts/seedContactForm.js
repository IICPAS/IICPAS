import mongoose from "mongoose";
import ContactForm from "../models/ContactForm.js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/iicpa");
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

// Default contact form configuration
const defaultContactForm = {
  smallText: "🎓 Get In Touch",
  mainHeading: "We're Here To Help And Ready To Hear From You",
  formFields: {
    nameField: {
      placeholder: "Enter your name",
      required: true,
      visible: true,
    },
    emailField: {
      placeholder: "Enter your email",
      required: true,
      visible: true,
    },
    phoneField: {
      placeholder: "Write about your phone",
      required: true,
      visible: true,
    },
    messageField: {
      placeholder: "Write Your Message",
      required: true,
      visible: true,
      rows: 5,
    },
  },
  submitButton: {
    text: "Submit",
    icon: "FaPaperPlane",
    color: "bg-green-500 hover:bg-green-600",
  },
  messages: {
    successMessage: "Message sent successfully!",
    errorMessage: "Submission failed",
  },
  colors: {
    smallText: "text-green-600",
    mainHeading: "text-slate-900",
    buttonText: "text-white",
  },
  image: {
    url: "/images/contact-section.jpg",
    alt: "Contact Support",
  },
  isActive: true,
};

// Function to seed contact form configuration
const seedContactForm = async () => {
  try {
    // Clear existing contact form configurations
    await ContactForm.deleteMany({});
    console.log("Cleared existing contact form configurations");

    // Insert default contact form configuration
    const insertedContactForm = await ContactForm.create(defaultContactForm);
    console.log("Inserted default contact form configuration:", insertedContactForm._id);

    console.log("Contact form configuration seeded successfully!");
  } catch (error) {
    console.error("Error seeding contact form configuration:", error);
  }
};

// Main function
const main = async () => {
  await connectDB();
  await seedContactForm();
  await mongoose.connection.close();
  console.log("Database connection closed");
  process.exit(0);
};

// Run the script
main().catch((error) => {
  console.error("Script error:", error);
  process.exit(1);
});
