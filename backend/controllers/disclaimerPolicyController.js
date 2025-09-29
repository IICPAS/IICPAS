import DisclaimerPolicy from '../models/disclaimerPolicy.js';

// Get active disclaimer policy (public)
export const getActiveDisclaimerPolicy = async (req, res) => {
  try {
    const disclaimerPolicy = await DisclaimerPolicy.findOne({ isActive: true });
    
    if (!disclaimerPolicy) {
      return res.status(404).json({
        success: false,
        message: 'No active disclaimer policy found'
      });
    }

    res.json({
      success: true,
      data: disclaimerPolicy
    });
  } catch (error) {
    console.error('Error fetching disclaimer policy:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching disclaimer policy'
    });
  }
};

// Get all disclaimer policy versions (admin only)
export const getAllDisclaimerPolicies = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'Admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }

    const disclaimerPolicies = await DisclaimerPolicy.find().sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: disclaimerPolicies
    });
  } catch (error) {
    console.error('Error fetching disclaimer policies:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching disclaimer policies'
    });
  }
};

// Get disclaimer policy by ID (admin only)
export const getDisclaimerPolicyById = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'Admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }

    const { id } = req.params;
    const disclaimerPolicy = await DisclaimerPolicy.findById(id);
    
    if (!disclaimerPolicy) {
      return res.status(404).json({
        success: false,
        message: 'Disclaimer policy not found'
      });
    }

    res.json({
      success: true,
      data: disclaimerPolicy
    });
  } catch (error) {
    console.error('Error fetching disclaimer policy:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching disclaimer policy'
    });
  }
};

// Create new disclaimer policy (admin only)
export const createDisclaimerPolicy = async (req, res) => {
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

    // Deactivate current active policy
    await DisclaimerPolicy.updateMany({ isActive: true }, { isActive: false });

    // Create new disclaimer policy
    const newDisclaimerPolicy = new DisclaimerPolicy({
      title,
      lastUpdated,
      sections,
      contactInfo,
      isActive: true
    });

    await newDisclaimerPolicy.save();

    res.status(201).json({
      success: true,
      message: 'Disclaimer policy created successfully',
      data: newDisclaimerPolicy
    });
  } catch (error) {
    console.error('Error creating disclaimer policy:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating disclaimer policy'
    });
  }
};

// Update disclaimer policy (admin only)
export const updateDisclaimerPolicy = async (req, res) => {
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

    const disclaimerPolicy = await DisclaimerPolicy.findById(id);
    
    if (!disclaimerPolicy) {
      return res.status(404).json({
        success: false,
        message: 'Disclaimer policy not found'
      });
    }

    // Update fields
    if (title) disclaimerPolicy.title = title;
    if (lastUpdated) disclaimerPolicy.lastUpdated = lastUpdated;
    if (sections) disclaimerPolicy.sections = sections;
    if (contactInfo) disclaimerPolicy.contactInfo = contactInfo;

    await disclaimerPolicy.save();

    res.json({
      success: true,
      message: 'Disclaimer policy updated successfully',
      data: disclaimerPolicy
    });
  } catch (error) {
    console.error('Error updating disclaimer policy:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating disclaimer policy'
    });
  }
};

// Activate disclaimer policy (admin only)
export const activateDisclaimerPolicy = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'Admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }

    const { id } = req.params;

    // Deactivate all policies
    await DisclaimerPolicy.updateMany({ isActive: true }, { isActive: false });

    // Activate the selected policy
    const disclaimerPolicy = await DisclaimerPolicy.findByIdAndUpdate(
      id,
      { isActive: true },
      { new: true }
    );

    if (!disclaimerPolicy) {
      return res.status(404).json({
        success: false,
        message: 'Disclaimer policy not found'
      });
    }

    res.json({
      success: true,
      message: 'Disclaimer policy activated successfully',
      data: disclaimerPolicy
    });
  } catch (error) {
    console.error('Error activating disclaimer policy:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while activating disclaimer policy'
    });
  }
};

// Delete disclaimer policy (admin only)
export const deleteDisclaimerPolicy = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'Admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }

    const { id } = req.params;

    const disclaimerPolicy = await DisclaimerPolicy.findById(id);
    
    if (!disclaimerPolicy) {
      return res.status(404).json({
        success: false,
        message: 'Disclaimer policy not found'
      });
    }

    // Don't allow deletion of active policy
    if (disclaimerPolicy.isActive) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete active disclaimer policy. Please activate another policy first.'
      });
    }

    await DisclaimerPolicy.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Disclaimer policy deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting disclaimer policy:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting disclaimer policy'
    });
  }
};
