// controllers/contactController.js
import Contact from "../models/ContactModel.js";

// @desc    Submit Contact Form
// @route   POST /api/contact
export const submitContactForm = async (req, res) => {
  console.log("hi");
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !phone || !message) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const newContact = new Contact({ name, email, phone, message });
    await newContact.save();

    res.status(201).json({ message: "Contact form submitted successfully." });
  } catch (error) {
    console.error("Contact submission failed:", error);
    res.status(500).json({ error: "Server error." });
  }
};

// @desc    Get All Contact Submissions (Admin only)
// @route   GET /api/contact
export const getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json(contacts);
  } catch (error) {
    console.error("Fetching contacts failed:", error);
    res.status(500).json({ error: "Server error." });
  }
};
