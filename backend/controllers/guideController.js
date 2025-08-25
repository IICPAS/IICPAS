import Guide from "../models/Guide.js";

// Get all guides
export const getAllGuides = async (req, res) => {
  try {
    const guides = await Guide.find().sort({ order: 1, createdAt: -1 });
    res.status(200).json(guides);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get guides by category
export const getGuidesByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const guides = await Guide.find({ 
      category, 
      status: "active" 
    }).sort({ order: 1, createdAt: -1 });
    res.status(200).json(guides);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single guide by ID
export const getGuideById = async (req, res) => {
  try {
    const guide = await Guide.findById(req.params.id);
    if (!guide) {
      return res.status(404).json({ message: "Guide not found" });
    }
    res.status(200).json(guide);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new guide
export const createGuide = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      type,
      icon,
      fileUrl,
      externalUrl,
      actionButtons,
      order
    } = req.body;

    // Validate required fields
    if (!title || !description || !category || !type) {
      return res.status(400).json({
        message: "Title, description, category, and type are required"
      });
    }

    // Validate action buttons if provided
    if (actionButtons && Array.isArray(actionButtons)) {
      for (const button of actionButtons) {
        if (!button.label || !button.action) {
          return res.status(400).json({
            message: "Action buttons must have label and action"
          });
        }
      }
    }

    const newGuide = new Guide({
      title,
      description,
      category,
      type,
      icon: icon || "document",
      fileUrl,
      externalUrl,
      actionButtons: actionButtons || [],
      order: order || 0
    });

    await newGuide.save();
    res.status(201).json(newGuide);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a guide
export const updateGuide = async (req, res) => {
  try {
    const updatedGuide = await Guide.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!updatedGuide) {
      return res.status(404).json({ message: "Guide not found" });
    }
    
    res.status(200).json(updatedGuide);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a guide
export const deleteGuide = async (req, res) => {
  try {
    const deletedGuide = await Guide.findByIdAndDelete(req.params.id);
    
    if (!deletedGuide) {
      return res.status(404).json({ message: "Guide not found" });
    }
    
    res.status(200).json({ message: "Guide deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Toggle guide status
export const toggleGuideStatus = async (req, res) => {
  try {
    const guide = await Guide.findById(req.params.id);
    
    if (!guide) {
      return res.status(404).json({ message: "Guide not found" });
    }
    
    guide.status = guide.status === "active" ? "inactive" : "active";
    await guide.save();
    
    res.status(200).json(guide);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update guide order
export const updateGuideOrder = async (req, res) => {
  try {
    const { guides } = req.body; // Array of { id, order }
    
    if (!Array.isArray(guides)) {
      return res.status(400).json({ message: "Guides array is required" });
    }
    
    // Update each guide's order
    for (const guideUpdate of guides) {
      await Guide.findByIdAndUpdate(guideUpdate.id, { order: guideUpdate.order });
    }
    
    res.status(200).json({ message: "Guide order updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Increment download count
export const incrementDownloads = async (req, res) => {
  try {
    const guide = await Guide.findById(req.params.id);
    
    if (!guide) {
      return res.status(404).json({ message: "Guide not found" });
    }
    
    guide.downloads += 1;
    await guide.save();
    
    res.status(200).json({ downloads: guide.downloads });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Increment view count
export const incrementViews = async (req, res) => {
  try {
    const guide = await Guide.findById(req.params.id);
    
    if (!guide) {
      return res.status(404).json({ message: "Guide not found" });
    }
    
    guide.views += 1;
    await guide.save();
    
    res.status(200).json({ views: guide.views });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
