import IICPAReview from '../models/iicpaReview.js';

// Get active IICPA Review (public)
export const getActiveIICPAReview = async (req, res) => {
  try {
    const iicpaReview = await IICPAReview.findOne({ isActive: true });
    
    if (!iicpaReview) {
      return res.status(404).json({
        success: false,
        message: 'No active IICPA Review found'
      });
    }

    res.json({
      success: true,
      data: iicpaReview
    });
  } catch (error) {
    console.error('Error fetching IICPA Review:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching IICPA Review'
    });
  }
};

// Get all IICPA Review versions (admin only)
export const getAllIICPAReviews = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'Admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }

    const iicpaReviews = await IICPAReview.find().sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: iicpaReviews
    });
  } catch (error) {
    console.error('Error fetching IICPA Reviews:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching IICPA Reviews'
    });
  }
};

// Get IICPA Review by ID (admin only)
export const getIICPAReviewById = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'Admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }

    const { id } = req.params;
    const iicpaReview = await IICPAReview.findById(id);
    
    if (!iicpaReview) {
      return res.status(404).json({
        success: false,
        message: 'IICPA Review not found'
      });
    }

    res.json({
      success: true,
      data: iicpaReview
    });
  } catch (error) {
    console.error('Error fetching IICPA Review:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching IICPA Review'
    });
  }
};

// Create new IICPA Review (admin only)
export const createIICPAReview = async (req, res) => {
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

    // Deactivate current active review
    await IICPAReview.updateMany({ isActive: true }, { isActive: false });

    // Create new IICPA Review
    const newIICPAReview = new IICPAReview({
      title,
      lastUpdated,
      sections,
      contactInfo,
      isActive: true
    });

    await newIICPAReview.save();

    res.status(201).json({
      success: true,
      message: 'IICPA Review created successfully',
      data: newIICPAReview
    });
  } catch (error) {
    console.error('Error creating IICPA Review:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating IICPA Review'
    });
  }
};

// Update IICPA Review (admin only)
export const updateIICPAReview = async (req, res) => {
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

    const iicpaReview = await IICPAReview.findById(id);
    
    if (!iicpaReview) {
      return res.status(404).json({
        success: false,
        message: 'IICPA Review not found'
      });
    }

    // Update fields
    if (title) iicpaReview.title = title;
    if (lastUpdated) iicpaReview.lastUpdated = lastUpdated;
    if (sections) iicpaReview.sections = sections;
    if (contactInfo) iicpaReview.contactInfo = contactInfo;

    await iicpaReview.save();

    res.json({
      success: true,
      message: 'IICPA Review updated successfully',
      data: iicpaReview
    });
  } catch (error) {
    console.error('Error updating IICPA Review:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating IICPA Review'
    });
  }
};

// Activate IICPA Review (admin only)
export const activateIICPAReview = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'Admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }

    const { id } = req.params;

    // Deactivate all reviews
    await IICPAReview.updateMany({ isActive: true }, { isActive: false });

    // Activate the selected review
    const iicpaReview = await IICPAReview.findByIdAndUpdate(
      id,
      { isActive: true },
      { new: true }
    );

    if (!iicpaReview) {
      return res.status(404).json({
        success: false,
        message: 'IICPA Review not found'
      });
    }

    res.json({
      success: true,
      message: 'IICPA Review activated successfully',
      data: iicpaReview
    });
  } catch (error) {
    console.error('Error activating IICPA Review:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while activating IICPA Review'
    });
  }
};

// Delete IICPA Review (admin only)
export const deleteIICPAReview = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'Admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }

    const { id } = req.params;

    const iicpaReview = await IICPAReview.findById(id);
    
    if (!iicpaReview) {
      return res.status(404).json({
        success: false,
        message: 'IICPA Review not found'
      });
    }

    // Don't allow deletion of active review
    if (iicpaReview.isActive) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete active IICPA Review. Please activate another review first.'
      });
    }

    await IICPAReview.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'IICPA Review deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting IICPA Review:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting IICPA Review'
    });
  }
};
