import TermsOfService from '../models/termsOfService.js';

// Get active terms of service (public)
export const getActiveTermsOfService = async (req, res) => {
  try {
    const termsOfService = await TermsOfService.findOne({ isActive: true });
    
    if (!termsOfService) {
      return res.status(404).json({
        success: false,
        message: 'No active terms of service found'
      });
    }

    res.json({
      success: true,
      data: termsOfService
    });
  } catch (error) {
    console.error('Error fetching terms of service:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching terms of service'
    });
  }
};

// Get all terms of service versions (admin only)
export const getAllTermsOfService = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'Admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }

    const termsOfService = await TermsOfService.find().sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: termsOfService
    });
  } catch (error) {
    console.error('Error fetching terms of service:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching terms of service'
    });
  }
};

// Get terms of service by ID (admin only)
export const getTermsOfServiceById = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'Admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }

    const { id } = req.params;
    const termsOfService = await TermsOfService.findById(id);
    
    if (!termsOfService) {
      return res.status(404).json({
        success: false,
        message: 'Terms of service not found'
      });
    }

    res.json({
      success: true,
      data: termsOfService
    });
  } catch (error) {
    console.error('Error fetching terms of service:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching terms of service'
    });
  }
};

// Create new terms of service (admin only)
export const createTermsOfService = async (req, res) => {
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

    // Deactivate current active terms of service
    await TermsOfService.updateMany({ isActive: true }, { isActive: false });

    // Create new terms of service
    const newTermsOfService = new TermsOfService({
      title,
      lastUpdated,
      sections,
      contactInfo,
      isActive: true
    });

    await newTermsOfService.save();

    res.status(201).json({
      success: true,
      message: 'Terms of service created successfully',
      data: newTermsOfService
    });
  } catch (error) {
    console.error('Error creating terms of service:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating terms of service'
    });
  }
};

// Update terms of service (admin only)
export const updateTermsOfService = async (req, res) => {
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

    const termsOfService = await TermsOfService.findById(id);
    
    if (!termsOfService) {
      return res.status(404).json({
        success: false,
        message: 'Terms of service not found'
      });
    }

    // Update fields
    if (title) termsOfService.title = title;
    if (lastUpdated) termsOfService.lastUpdated = lastUpdated;
    if (sections) termsOfService.sections = sections;
    if (contactInfo) termsOfService.contactInfo = contactInfo;

    await termsOfService.save();

    res.json({
      success: true,
      message: 'Terms of service updated successfully',
      data: termsOfService
    });
  } catch (error) {
    console.error('Error updating terms of service:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating terms of service'
    });
  }
};

// Activate terms of service (admin only)
export const activateTermsOfService = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'Admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }

    const { id } = req.params;

    // Deactivate all terms of service
    await TermsOfService.updateMany({ isActive: true }, { isActive: false });

    // Activate the selected terms of service
    const termsOfService = await TermsOfService.findByIdAndUpdate(
      id,
      { isActive: true },
      { new: true }
    );

    if (!termsOfService) {
      return res.status(404).json({
        success: false,
        message: 'Terms of service not found'
      });
    }

    res.json({
      success: true,
      message: 'Terms of service activated successfully',
      data: termsOfService
    });
  } catch (error) {
    console.error('Error activating terms of service:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while activating terms of service'
    });
  }
};

// Delete terms of service (admin only)
export const deleteTermsOfService = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'Admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }

    const { id } = req.params;

    const termsOfService = await TermsOfService.findById(id);
    
    if (!termsOfService) {
      return res.status(404).json({
        success: false,
        message: 'Terms of service not found'
      });
    }

    // Don't allow deletion of active terms of service
    if (termsOfService.isActive) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete active terms of service. Please activate another version first.'
      });
    }

    await TermsOfService.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Terms of service deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting terms of service:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting terms of service'
    });
  }
};
