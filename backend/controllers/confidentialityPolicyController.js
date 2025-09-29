import ConfidentialityPolicy from '../models/confidentialityPolicy.js';

// Get active confidentiality policy (public)
export const getActiveConfidentialityPolicy = async (req, res) => {
  try {
    const confidentialityPolicy = await ConfidentialityPolicy.findOne({ isActive: true });
    
    if (!confidentialityPolicy) {
      return res.status(404).json({
        success: false,
        message: 'No active confidentiality policy found'
      });
    }

    res.json({
      success: true,
      data: confidentialityPolicy
    });
  } catch (error) {
    console.error('Error fetching confidentiality policy:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching confidentiality policy'
    });
  }
};

// Get all confidentiality policy versions (admin only)
export const getAllConfidentialityPolicies = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'Admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }

    const confidentialityPolicies = await ConfidentialityPolicy.find().sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: confidentialityPolicies
    });
  } catch (error) {
    console.error('Error fetching confidentiality policies:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching confidentiality policies'
    });
  }
};

// Get confidentiality policy by ID (admin only)
export const getConfidentialityPolicyById = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'Admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }

    const { id } = req.params;
    const confidentialityPolicy = await ConfidentialityPolicy.findById(id);
    
    if (!confidentialityPolicy) {
      return res.status(404).json({
        success: false,
        message: 'Confidentiality policy not found'
      });
    }

    res.json({
      success: true,
      data: confidentialityPolicy
    });
  } catch (error) {
    console.error('Error fetching confidentiality policy:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching confidentiality policy'
    });
  }
};

// Create new confidentiality policy (admin only)
export const createConfidentialityPolicy = async (req, res) => {
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
    await ConfidentialityPolicy.updateMany({ isActive: true }, { isActive: false });

    // Create new confidentiality policy
    const newConfidentialityPolicy = new ConfidentialityPolicy({
      title,
      lastUpdated,
      sections,
      contactInfo,
      isActive: true
    });

    await newConfidentialityPolicy.save();

    res.status(201).json({
      success: true,
      message: 'Confidentiality policy created successfully',
      data: newConfidentialityPolicy
    });
  } catch (error) {
    console.error('Error creating confidentiality policy:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating confidentiality policy'
    });
  }
};

// Update confidentiality policy (admin only)
export const updateConfidentialityPolicy = async (req, res) => {
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

    const confidentialityPolicy = await ConfidentialityPolicy.findById(id);
    
    if (!confidentialityPolicy) {
      return res.status(404).json({
        success: false,
        message: 'Confidentiality policy not found'
      });
    }

    // Update fields
    if (title) confidentialityPolicy.title = title;
    if (lastUpdated) confidentialityPolicy.lastUpdated = lastUpdated;
    if (sections) confidentialityPolicy.sections = sections;
    if (contactInfo) confidentialityPolicy.contactInfo = contactInfo;

    await confidentialityPolicy.save();

    res.json({
      success: true,
      message: 'Confidentiality policy updated successfully',
      data: confidentialityPolicy
    });
  } catch (error) {
    console.error('Error updating confidentiality policy:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating confidentiality policy'
    });
  }
};

// Activate confidentiality policy (admin only)
export const activateConfidentialityPolicy = async (req, res) => {
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
    await ConfidentialityPolicy.updateMany({ isActive: true }, { isActive: false });

    // Activate the selected policy
    const confidentialityPolicy = await ConfidentialityPolicy.findByIdAndUpdate(
      id,
      { isActive: true },
      { new: true }
    );

    if (!confidentialityPolicy) {
      return res.status(404).json({
        success: false,
        message: 'Confidentiality policy not found'
      });
    }

    res.json({
      success: true,
      message: 'Confidentiality policy activated successfully',
      data: confidentialityPolicy
    });
  } catch (error) {
    console.error('Error activating confidentiality policy:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while activating confidentiality policy'
    });
  }
};

// Delete confidentiality policy (admin only)
export const deleteConfidentialityPolicy = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'Admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }

    const { id } = req.params;

    const confidentialityPolicy = await ConfidentialityPolicy.findById(id);
    
    if (!confidentialityPolicy) {
      return res.status(404).json({
        success: false,
        message: 'Confidentiality policy not found'
      });
    }

    // Don't allow deletion of active policy
    if (confidentialityPolicy.isActive) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete active confidentiality policy. Please activate another policy first.'
      });
    }

    await ConfidentialityPolicy.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Confidentiality policy deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting confidentiality policy:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting confidentiality policy'
    });
  }
};
