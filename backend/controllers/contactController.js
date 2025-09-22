// controllers/contactController.js
import Contact from "../models/ContactModel.js";
import Message from "../models/Message.js";

// @desc    Submit Contact Form
// @route   POST /api/contact
export const submitContactForm = async (req, res) => {
  console.log("hi");
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !phone || !message) {
      return res.status(400).json({ error: "All fields are required." });
    }

    // Save to both Contact and Message models
    const newContact = new Contact({ name, email, phone, message });
    await newContact.save();

    const newMessage = new Message({ email, phone, message });
    await newMessage.save();

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

// @desc    Get All Messages (Admin only)
// @route   GET /api/messages
export const getAllMessages = async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.status(200).json(messages);
  } catch (error) {
    console.error("Fetching messages failed:", error);
    res.status(500).json({ error: "Server error." });
  }
};

// @desc    Reply to Message (Admin only)
// @route   PUT /api/messages/:id/reply
export const replyToMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { adminReply, adminRepliedBy } = req.body;

    if (!adminReply) {
      return res.status(400).json({ error: "Reply message is required." });
    }

    const message = await Message.findByIdAndUpdate(
      id,
      {
        adminReply,
        adminRepliedBy: adminRepliedBy || req.user?.name || "Admin",
        adminRepliedAt: new Date(),
        status: "replied"
      },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({ error: "Message not found." });
    }

    res.status(200).json(message);
  } catch (error) {
    console.error("Replying to message failed:", error);
    res.status(500).json({ error: "Server error." });
  }
};
