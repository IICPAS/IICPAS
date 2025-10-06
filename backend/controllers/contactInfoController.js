import ContactInfo from "../models/ContactInfo.js";

// Get all contact information
export const getAllContactInfo = async (req, res) => {
  try {
    const contactInfo = await ContactInfo.find().sort({
      order: 1,
      createdAt: 1,
    });
    res.status(200).json(contactInfo);
  } catch (error) {
    console.error("Error fetching contact info:", error);
    res.status(500).json({ error: "Failed to fetch contact information" });
  }
};

// Get active contact information (for public use)
export const getActiveContactInfo = async (req, res) => {
  try {
    const contactInfo = await ContactInfo.find({ isActive: true }).sort({
      order: 1,
      createdAt: 1,
    });
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
      return res
        .status(400)
        .json({ error: "Title, content, and icon are required" });
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

    const contactInfo = await ContactInfo.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

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

    // Find the current contact info to get the current status
    const currentContactInfo = await ContactInfo.findById(id);

    if (!currentContactInfo) {
      return res.status(404).json({ error: "Contact information not found" });
    }

    // Toggle the status
    const newStatus = !currentContactInfo.isActive;

    const contactInfo = await ContactInfo.findByIdAndUpdate(
      id,
      { isActive: newStatus },
      { new: true, runValidators: true }
    );

    res.status(200).json(contactInfo);
  } catch (error) {
    console.error("Error toggling contact info status:", error);
    res
      .status(500)
      .json({ error: "Failed to update contact information status" });
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

    res
      .status(200)
      .json({ message: "Contact information deleted successfully" });
  } catch (error) {
    console.error("Error deleting contact info:", error);
    res.status(500).json({ error: "Failed to delete contact information" });
  }
};

// Update order of contact information
export const updateContactInfoOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { direction } = req.body;

    if (!direction || !["up", "down"].includes(direction)) {
      return res
        .status(400)
        .json({ error: "Direction must be 'up' or 'down'" });
    }

    // Get all contact info items sorted by order
    const allContactInfo = await ContactInfo.find().sort({
      order: 1,
      createdAt: 1,
    });
    const currentIndex = allContactInfo.findIndex(
      (item) => item._id.toString() === id
    );

    if (currentIndex === -1) {
      return res.status(404).json({ error: "Contact information not found" });
    }

    // Calculate new index based on direction
    let newIndex;
    if (direction === "up" && currentIndex > 0) {
      newIndex = currentIndex - 1;
    } else if (
      direction === "down" &&
      currentIndex < allContactInfo.length - 1
    ) {
      newIndex = currentIndex + 1;
    } else {
      return res
        .status(400)
        .json({ error: "Cannot move item in that direction" });
    }

    // Swap the orders
    const currentItem = allContactInfo[currentIndex];
    const targetItem = allContactInfo[newIndex];

    await ContactInfo.findByIdAndUpdate(currentItem._id, {
      order: targetItem.order,
    });
    await ContactInfo.findByIdAndUpdate(targetItem._id, {
      order: currentItem.order,
    });

    // Return updated list
    const updatedContactInfo = await ContactInfo.find().sort({
      order: 1,
      createdAt: 1,
    });
    res.status(200).json(updatedContactInfo);
  } catch (error) {
    console.error("Error updating contact info order:", error);
    res
      .status(500)
      .json({ error: "Failed to update contact information order" });
  }
};
