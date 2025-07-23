// controllers/leadController.js
import Lead from "../models/Lead.js";

export const createLead = async (req, res) => {
  try {
    const { name, email, phone, message, type } = req.body;
    const newLead = new Lead({ name, email, phone, message, type });
    await newLead.save();
    res.status(201).json({ success: true, lead: newLead });
  } catch (err) {
    console.error("Error creating lead:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

export const getLeads = async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, leads });
  } catch (err) {
    console.error("Error fetching leads:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
};
