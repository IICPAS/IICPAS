import CookiePolicy from '../models/cookiePolicy.js';

// Get active cookie policy (public)
export const getActiveCookiePolicy = async (req, res) => {
  try {
    const cookiePolicy = await CookiePolicy.findOne({ isActive: true });
    
    if (!cookiePolicy) {
      return res.status(404).json({
        success: false,
        message: 'No active cookie policy found'
      });
    }

    res.json({
      success: true,
      data: cookiePolicy
    });
  } catch (error) {
    console.error('Error fetching cookie policy:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching cookie policy'
    });
  }
};

// Get all cookie policy versions (admin only)
export const getAllCookiePolicies = async (req, res) => {
  try {
    const cookiePolicies = await CookiePolicy.find().sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: cookiePolicies
    });
  } catch (error) {
    console.error('Error fetching cookie policies:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching cookie policies'
    });
  }
};

// Get specific cookie policy by ID (admin only)
export const getCookiePolicyById = async (req, res) => {
  try {
    const { id } = req.params;
    const cookiePolicy = await CookiePolicy.findById(id);
    
    if (!cookiePolicy) {
      return res.status(404).json({
        success: false,
        message: 'Cookie policy not found'
      });
    }

    res.json({
      success: true,
      data: cookiePolicy
    });
  } catch (error) {
    console.error('Error fetching cookie policy:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching cookie policy'
    });
  }
};

// Create new cookie policy (admin only)
export const createCookiePolicy = async (req, res) => {
  try {
    const cookiePolicyData = req.body;
    
    // Set all existing policies as inactive
    await CookiePolicy.updateMany({}, { isActive: false });
    
    const cookiePolicy = new CookiePolicy(cookiePolicyData);
    await cookiePolicy.save();

    res.status(201).json({
      success: true,
      data: cookiePolicy,
      message: 'Cookie policy created successfully'
    });
  } catch (error) {
    console.error('Error creating cookie policy:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating cookie policy'
    });
  }
};

// Update cookie policy (admin only)
export const updateCookiePolicy = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const cookiePolicy = await CookiePolicy.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!cookiePolicy) {
      return res.status(404).json({
        success: false,
        message: 'Cookie policy not found'
      });
    }

    res.json({
      success: true,
      data: cookiePolicy,
      message: 'Cookie policy updated successfully'
    });
  } catch (error) {
    console.error('Error updating cookie policy:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating cookie policy'
    });
  }
};

// Activate cookie policy (admin only)
export const activateCookiePolicy = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Set all policies as inactive first
    await CookiePolicy.updateMany({}, { isActive: false });
    
    // Activate the selected policy
    const cookiePolicy = await CookiePolicy.findByIdAndUpdate(
      id,
      { isActive: true },
      { new: true }
    );

    if (!cookiePolicy) {
      return res.status(404).json({
        success: false,
        message: 'Cookie policy not found'
      });
    }

    res.json({
      success: true,
      data: cookiePolicy,
      message: 'Cookie policy activated successfully'
    });
  } catch (error) {
    console.error('Error activating cookie policy:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while activating cookie policy'
    });
  }
};

// Delete cookie policy (admin only)
export const deleteCookiePolicy = async (req, res) => {
  try {
    const { id } = req.params;
    
    const cookiePolicy = await CookiePolicy.findByIdAndDelete(id);

    if (!cookiePolicy) {
      return res.status(404).json({
        success: false,
        message: 'Cookie policy not found'
      });
    }

    res.json({
      success: true,
      message: 'Cookie policy deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting cookie policy:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting cookie policy'
    });
  }
};
