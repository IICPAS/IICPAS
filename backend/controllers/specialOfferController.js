import SpecialOffer from "../models/SpecialOffer.js";

// Get all special offers
export const getAllSpecialOffers = async (req, res) => {
  try {
    const { location, active } = req.query;

    let query = {};

    if (location) {
      query.displayLocation = location;
    }

    if (active === "true") {
      query.isActive = true;
      query.expiryDate = { $gt: new Date() }; // Not expired
    }

    const offers = await SpecialOffer.find(query).sort({
      priority: -1,
      createdAt: -1,
    });

    res.json({
      success: true,
      data: offers,
    });
  } catch (error) {
    console.error("Error fetching special offers:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch special offers",
      error: error.message,
    });
  }
};

// Get active special offers for display
export const getActiveSpecialOffers = async (req, res) => {
  try {
    const { location = "admin_dashboard" } = req.query;

    const offers = await SpecialOffer.find({
      $or: [{ displayLocation: location }, { displayLocation: "all" }],
      isActive: true,
      expiryDate: { $gt: new Date() }, // Not expired
    })
      .sort({ priority: -1, createdAt: -1 })
      .limit(5); // Limit to 5 active offers

    res.json({
      success: true,
      data: offers,
    });
  } catch (error) {
    console.error("Error fetching active special offers:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch active special offers",
      error: error.message,
    });
  }
};

// Get special offer by ID
export const getSpecialOfferById = async (req, res) => {
  try {
    const { id } = req.params;

    const offer = await SpecialOffer.findById(id);

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: "Special offer not found",
      });
    }

    res.json({
      success: true,
      data: offer,
    });
  } catch (error) {
    console.error("Error fetching special offer:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch special offer",
      error: error.message,
    });
  }
};

// Create new special offer
export const createSpecialOffer = async (req, res) => {
  try {
    const {
      title,
      description,
      icon,
      backgroundColor,
      textColor,
      expiryDate,
      priority,
      displayLocation,
    } = req.body;

    // Validate required fields
    if (!title || !description || !expiryDate) {
      return res.status(400).json({
        success: false,
        message: "Title, description, and expiry date are required",
      });
    }

    // Validate expiry date is in the future
    const expiry = new Date(expiryDate);
    if (expiry <= new Date()) {
      return res.status(400).json({
        success: false,
        message: "Expiry date must be in the future",
      });
    }

    const newOffer = new SpecialOffer({
      title,
      description,
      icon: icon || "party_pomp",
      backgroundColor: backgroundColor || "#FF6B6B",
      textColor: textColor || "#FFFFFF",
      expiryDate: expiry,
      priority: priority || 1,
      displayLocation: displayLocation || "admin_dashboard",
    });

    const savedOffer = await newOffer.save();

    res.status(201).json({
      success: true,
      message: "Special offer created successfully",
      data: savedOffer,
    });
  } catch (error) {
    console.error("Error creating special offer:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create special offer",
      error: error.message,
    });
  }
};

// Update special offer
export const updateSpecialOffer = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      icon,
      backgroundColor,
      textColor,
      expiryDate,
      isActive,
      priority,
      displayLocation,
    } = req.body;

    const offer = await SpecialOffer.findById(id);

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: "Special offer not found",
      });
    }

    // Validate expiry date if provided
    if (expiryDate) {
      const expiry = new Date(expiryDate);
      if (expiry <= new Date()) {
        return res.status(400).json({
          success: false,
          message: "Expiry date must be in the future",
        });
      }
      offer.expiryDate = expiry;
    }

    // Update fields
    if (title) offer.title = title;
    if (description) offer.description = description;
    if (icon) offer.icon = icon;
    if (backgroundColor) offer.backgroundColor = backgroundColor;
    if (textColor) offer.textColor = textColor;
    if (isActive !== undefined) offer.isActive = isActive;
    if (priority) offer.priority = priority;
    if (displayLocation) offer.displayLocation = displayLocation;

    const updatedOffer = await offer.save();

    res.json({
      success: true,
      message: "Special offer updated successfully",
      data: updatedOffer,
    });
  } catch (error) {
    console.error("Error updating special offer:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update special offer",
      error: error.message,
    });
  }
};

// Delete special offer
export const deleteSpecialOffer = async (req, res) => {
  try {
    const { id } = req.params;

    const offer = await SpecialOffer.findById(id);

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: "Special offer not found",
      });
    }

    await SpecialOffer.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Special offer deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting special offer:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete special offer",
      error: error.message,
    });
  }
};

// Toggle offer status
export const toggleOfferStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const offer = await SpecialOffer.findById(id);

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: "Special offer not found",
      });
    }

    offer.isActive = !offer.isActive;
    const updatedOffer = await offer.save();

    res.json({
      success: true,
      message: `Special offer ${
        updatedOffer.isActive ? "activated" : "deactivated"
      } successfully`,
      data: updatedOffer,
    });
  } catch (error) {
    console.error("Error toggling offer status:", error);
    res.status(500).json({
      success: false,
      message: "Failed to toggle offer status",
      error: error.message,
    });
  }
};
