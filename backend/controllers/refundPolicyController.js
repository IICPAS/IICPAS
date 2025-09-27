import RefundPolicy from '../models/refundPolicy.js';

// Get active refund policy (public)
export const getActiveRefundPolicy = async (req, res) => {
  try {
    const refundPolicy = await RefundPolicy.findOne({ isActive: true });
    
    if (!refundPolicy) {
      return res.status(404).json({
        success: false,
        message: 'No active refund policy found'
      });
    }

    res.json({
      success: true,
      data: refundPolicy
    });
  } catch (error) {
    console.error('Error fetching refund policy:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching refund policy'
    });
  }
};

// Get all refund policies (admin only)
export const getAllRefundPolicies = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'Admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }

    const refundPolicies = await RefundPolicy.find().sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: refundPolicies
    });
  } catch (error) {
    console.error('Error fetching refund policies:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching refund policies'
    });
  }
};

// Get single refund policy by ID (admin only)
export const getRefundPolicyById = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'Admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }

    const { id } = req.params;
    const refundPolicy = await RefundPolicy.findById(id);
    
    if (!refundPolicy) {
      return res.status(404).json({
        success: false,
        message: 'Refund policy not found'
      });
    }

    res.json({
      success: true,
      data: refundPolicy
    });
  } catch (error) {
    console.error('Error fetching refund policy:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching refund policy'
    });
  }
};

// Create new refund policy (admin only)
export const createRefundPolicy = async (req, res) => {
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
    await RefundPolicy.updateMany({ isActive: true }, { isActive: false });

    // Create new refund policy
    const newRefundPolicy = new RefundPolicy({
      title,
      lastUpdated,
      sections,
      contactInfo,
      isActive: true
    });

    await newRefundPolicy.save();

    res.status(201).json({
      success: true,
      message: 'Refund policy created successfully',
      data: newRefundPolicy
    });
  } catch (error) {
    console.error('Error creating refund policy:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating refund policy'
    });
  }
};

// Update refund policy (admin only)
export const updateRefundPolicy = async (req, res) => {
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

    const refundPolicy = await RefundPolicy.findById(id);
    
    if (!refundPolicy) {
      return res.status(404).json({
        success: false,
        message: 'Refund policy not found'
      });
    }

    // Update fields
    if (title) refundPolicy.title = title;
    if (lastUpdated) refundPolicy.lastUpdated = lastUpdated;
    if (sections) refundPolicy.sections = sections;
    if (contactInfo) refundPolicy.contactInfo = contactInfo;

    await refundPolicy.save();

    res.json({
      success: true,
      message: 'Refund policy updated successfully',
      data: refundPolicy
    });
  } catch (error) {
    console.error('Error updating refund policy:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating refund policy'
    });
  }
};

// Activate refund policy (admin only)
export const activateRefundPolicy = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'Admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }

    const { id } = req.params;

    // Deactivate all policies first
    await RefundPolicy.updateMany({ isActive: true }, { isActive: false });

    // Activate the selected policy
    const refundPolicy = await RefundPolicy.findByIdAndUpdate(
      id,
      { isActive: true },
      { new: true }
    );

    if (!refundPolicy) {
      return res.status(404).json({
        success: false,
        message: 'Refund policy not found'
      });
    }

    res.json({
      success: true,
      message: 'Refund policy activated successfully',
      data: refundPolicy
    });
  } catch (error) {
    console.error('Error activating refund policy:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while activating refund policy'
    });
  }
};

// Delete refund policy (admin only)
export const deleteRefundPolicy = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'Admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }

    const { id } = req.params;

    const refundPolicy = await RefundPolicy.findById(id);
    
    if (!refundPolicy) {
      return res.status(404).json({
        success: false,
        message: 'Refund policy not found'
      });
    }

    // Don't allow deletion of active policy
    if (refundPolicy.isActive) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete active refund policy. Please activate another policy first.'
      });
    }

    await RefundPolicy.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Refund policy deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting refund policy:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting refund policy'
    });
  }
};
