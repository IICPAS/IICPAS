import ContactInfo from "../models/ContactInfo.js";

// Get all contact information
export const getAllContactInfo = async (req, res) => {
  try {
    const contactInfo = await ContactInfo.find().sort({ order: 1, createdAt: 1 });
    res.status(200).json(contactInfo);
  } catch (error) {
    console.error("Error fetching contact info:", error);
    res.status(500).json({ error: "Failed to fetch contact information" });
  }
};

// Get active contact information (for public use)
export const getActiveContactInfo = async (req, res) => {
  try {
    const contactInfo = await ContactInfo.find({ isActive: true }).sort({ order: 1, createdAt: 1 });
    res.status(200).json(contactInfo);
  } catch (error) {
    console.error("Error fetching active contact info:", error);
    res.status(500).json({ error: "Failed to fetch contact information" });
  }
};

// Get single contact information by ID
export const getContactInfoById = async (req, res) => {
  try {
    const { id } = req.params;
    const contactInfo = await ContactInfo.findById(id);
    
    if (!contactInfo) {
      return res.status(404).json({ error: "Contact information not found" });
    }
    
    res.status(200).json(contactInfo);
  } catch (error) {
    console.error("Error fetching contact info by ID:", error);
    res.status(500).json({ error: "Failed to fetch contact information" });
  }
};

// Create new contact information
export const createContactInfo = async (req, res) => {
  try {
    const { title, content, icon, bg, isActive, order } = req.body;
    
    // Validate required fields
    if (!title || !content || !icon) {
      return res.status(400).json({ error: "Title, content, and icon are required" });
    }
    
    const contactInfo = new ContactInfo({
      title,
      content,
      icon,
      bg: bg || "from-purple-100 to-white",
      isActive: isActive !== undefined ? isActive : true,
      order: order || 0,
    });
    
    await contactInfo.save();
    res.status(201).json(contactInfo);
  } catch (error) {
    console.error("Error creating contact info:", error);
    res.status(500).json({ error: "Failed to create contact information" });
  }
};

// Update contact information
export const updateContactInfo = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const contactInfo = await ContactInfo.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!contactInfo) {
      return res.status(404).json({ error: "Contact information not found" });
    }
    
    res.status(200).json(contactInfo);
  } catch (error) {
    console.error("Error updating contact info:", error);
    res.status(500).json({ error: "Failed to update contact information" });
  }
};

// Toggle active status
export const toggleContactInfoStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;
    
    const contactInfo = await ContactInfo.findByIdAndUpdate(
      id,
      { isActive },
      { new: true, runValidators: true }
    );
    
    if (!contactInfo) {
      return res.status(404).json({ error: "Contact information not found" });
    }
    
    res.status(200).json(contactInfo);
  } catch (error) {
    console.error("Error toggling contact info status:", error);
    res.status(500).json({ error: "Failed to update contact information status" });
  }
};

// Delete contact information
export const deleteContactInfo = async (req, res) => {
  try {
    const { id } = req.params;
    
    const contactInfo = await ContactInfo.findByIdAndDelete(id);
    
    if (!contactInfo) {
      return res.status(404).json({ error: "Contact information not found" });
    }
    
    res.status(200).json({ message: "Contact information deleted successfully" });
  } catch (error) {
    console.error("Error deleting contact info:", error);
    res.status(500).json({ error: "Failed to delete contact information" });
  }
};

// Update order of contact information
export const updateContactInfoOrder = async (req, res) => {
  try {
    const { contactInfoList } = req.body;
    
    if (!Array.isArray(contactInfoList)) {
      return res.status(400).json({ error: "Contact info list must be an array" });
    }
    
    const updatePromises = contactInfoList.map((item, index) =>
      ContactInfo.findByIdAndUpdate(item.id, { order: index }, { new: true })
    );
    
    await Promise.all(updatePromises);
    
    const updatedContactInfo = await ContactInfo.find().sort({ order: 1, createdAt: 1 });
    res.status(200).json(updatedContactInfo);
  } catch (error) {
    console.error("Error updating contact info order:", error);
    res.status(500).json({ error: "Failed to update contact information order" });
  }
};
