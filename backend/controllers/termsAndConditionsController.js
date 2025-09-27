import TermsAndConditions from '../models/termsAndConditions.js';

// Get active terms and conditions (public)
export const getActiveTermsAndConditions = async (req, res) => {
  try {
    const termsAndConditions = await TermsAndConditions.findOne({ isActive: true });
    
    if (!termsAndConditions) {
      return res.status(404).json({
        success: false,
        message: 'No active terms and conditions found'
      });
    }

    res.json({
      success: true,
      data: termsAndConditions
    });
  } catch (error) {
    console.error('Error fetching terms and conditions:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching terms and conditions'
    });
  }
};

// Get all terms and conditions versions (admin only)
export const getAllTermsAndConditions = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'Admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }

    const termsAndConditions = await TermsAndConditions.find().sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: termsAndConditions
    });
  } catch (error) {
    console.error('Error fetching terms and conditions:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching terms and conditions'
    });
  }
};

// Get single terms and conditions by ID (admin only)
export const getTermsAndConditionsById = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'Admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }

    const { id } = req.params;
    const termsAndConditions = await TermsAndConditions.findById(id);
    
    if (!termsAndConditions) {
      return res.status(404).json({
        success: false,
        message: 'Terms and conditions not found'
      });
    }

    res.json({
      success: true,
      data: termsAndConditions
    });
  } catch (error) {
    console.error('Error fetching terms and conditions:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching terms and conditions'
    });
  }
};

// Create new terms and conditions (admin only)
export const createTermsAndConditions = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'Admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }

    const { title, lastUpdated, sections, contactInfo } = req.body;

    // Validate required fields
    if (!title || !lastUpdated || !sections || !contactInfo) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: title, lastUpdated, sections, contactInfo'
      });
    }

    // Deactivate current active terms and conditions
    await TermsAndConditions.updateMany({ isActive: true }, { isActive: false });

    // Create new terms and conditions
    const newTermsAndConditions = new TermsAndConditions({
      title,
      lastUpdated,
      sections,
      contactInfo,
      isActive: true
    });

    await newTermsAndConditions.save();

    res.status(201).json({
      success: true,
      message: 'Terms and conditions created successfully',
      data: newTermsAndConditions
    });
  } catch (error) {
    console.error('Error creating terms and conditions:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating terms and conditions'
    });
  }
};

// Update terms and conditions (admin only)
export const updateTermsAndConditions = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'Admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }

    const { id } = req.params;
    const { title, lastUpdated, sections, contactInfo } = req.body;

    const termsAndConditions = await TermsAndConditions.findById(id);
    
    if (!termsAndConditions) {
      return res.status(404).json({
        success: false,
        message: 'Terms and conditions not found'
      });
    }

    // Update fields
    if (title) termsAndConditions.title = title;
    if (lastUpdated) termsAndConditions.lastUpdated = lastUpdated;
    if (sections) termsAndConditions.sections = sections;
    if (contactInfo) termsAndConditions.contactInfo = contactInfo;

    await termsAndConditions.save();

    res.json({
      success: true,
      message: 'Terms and conditions updated successfully',
      data: termsAndConditions
    });
  } catch (error) {
    console.error('Error updating terms and conditions:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating terms and conditions'
    });
  }
};

// Activate terms and conditions (admin only)
export const activateTermsAndConditions = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'Admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }

    const { id } = req.params;

    // Deactivate all terms and conditions
    await TermsAndConditions.updateMany({ isActive: true }, { isActive: false });

    // Activate the selected terms and conditions
    const termsAndConditions = await TermsAndConditions.findByIdAndUpdate(
      id,
      { isActive: true },
      { new: true }
    );

    if (!termsAndConditions) {
      return res.status(404).json({
        success: false,
        message: 'Terms and conditions not found'
      });
    }

    res.json({
      success: true,
      message: 'Terms and conditions activated successfully',
      data: termsAndConditions
    });
  } catch (error) {
    console.error('Error activating terms and conditions:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while activating terms and conditions'
    });
  }
};

// Delete terms and conditions (admin only)
export const deleteTermsAndConditions = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'Admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }

    const { id } = req.params;

    const termsAndConditions = await TermsAndConditions.findById(id);
    
    if (!termsAndConditions) {
      return res.status(404).json({
        success: false,
        message: 'Terms and conditions not found'
      });
    }

    // Don't allow deletion of active terms and conditions
    if (termsAndConditions.isActive) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete active terms and conditions. Please activate another version first.'
      });
    }

    await TermsAndConditions.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Terms and conditions deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting terms and conditions:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting terms and conditions'
    });
  }
};
