import express from 'express';
import PrivacyPolicy from '../models/privacyPolicy.js';
import { requireAuth } from '../middleware/requireAuth.js';

const router = express.Router();

// Get privacy policy content (public endpoint)
router.get('/', async (req, res) => {
  try {
    const privacyPolicy = await PrivacyPolicy.findOne({ isActive: true });
    
    if (!privacyPolicy) {
      return res.status(404).json({ 
        success: false, 
        message: 'Privacy policy not found' 
      });
    }

    res.json({
      success: true,
      data: privacyPolicy
    });
  } catch (error) {
    console.error('Error fetching privacy policy:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching privacy policy'
    });
  }
});

// Get active privacy policy content (alternative endpoint)
router.get('/active', async (req, res) => {
  try {
    const privacyPolicy = await PrivacyPolicy.findOne({ isActive: true });
    
    if (!privacyPolicy) {
      return res.status(404).json({ 
        success: false, 
        message: 'Privacy policy not found' 
      });
    }

    res.json({
      success: true,
      data: privacyPolicy
    });
  } catch (error) {
    console.error('Error fetching active privacy policy:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching active privacy policy'
    });
  }
});

// Get all privacy policy versions (admin only)
router.get('/admin/all', requireAuth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'Admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }

    const privacyPolicies = await PrivacyPolicy.find().sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: privacyPolicies
    });
  } catch (error) {
    console.error('Error fetching all privacy policies:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching privacy policies'
    });
  }
});

// Get single privacy policy by ID (admin only)
router.get('/admin/:id', requireAuth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'Admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }

    const { id } = req.params;
    const privacyPolicy = await PrivacyPolicy.findById(id);
    
    if (!privacyPolicy) {
      return res.status(404).json({
        success: false,
        message: 'Privacy policy not found'
      });
    }

    res.json({
      success: true,
      data: privacyPolicy
    });
  } catch (error) {
    console.error('Error fetching privacy policy:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching privacy policy'
    });
  }
});

// Create new privacy policy (admin only)
router.post('/admin/create', requireAuth, async (req, res) => {
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
    await PrivacyPolicy.updateMany({ isActive: true }, { isActive: false });

    // Create new privacy policy
    const newPrivacyPolicy = new PrivacyPolicy({
      title,
      lastUpdated,
      sections,
      contactInfo,
      isActive: true
    });

    await newPrivacyPolicy.save();

    res.status(201).json({
      success: true,
      message: 'Privacy policy created successfully',
      data: newPrivacyPolicy
    });
  } catch (error) {
    console.error('Error creating privacy policy:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating privacy policy'
    });
  }
});

// Update privacy policy (admin only)
router.put('/admin/update/:id', requireAuth, async (req, res) => {
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

    const privacyPolicy = await PrivacyPolicy.findById(id);
    
    if (!privacyPolicy) {
      return res.status(404).json({
        success: false,
        message: 'Privacy policy not found'
      });
    }

    // Update fields
    if (title) privacyPolicy.title = title;
    if (lastUpdated) privacyPolicy.lastUpdated = lastUpdated;
    if (sections) privacyPolicy.sections = sections;
    if (contactInfo) privacyPolicy.contactInfo = contactInfo;

    await privacyPolicy.save();

    res.json({
      success: true,
      message: 'Privacy policy updated successfully',
      data: privacyPolicy
    });
  } catch (error) {
    console.error('Error updating privacy policy:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating privacy policy'
    });
  }
});

// Activate privacy policy (admin only)
router.put('/admin/activate/:id', requireAuth, async (req, res) => {
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
    await PrivacyPolicy.updateMany({ isActive: true }, { isActive: false });

    // Activate the selected policy
    const privacyPolicy = await PrivacyPolicy.findByIdAndUpdate(
      id,
      { isActive: true },
      { new: true }
    );

    if (!privacyPolicy) {
      return res.status(404).json({
        success: false,
        message: 'Privacy policy not found'
      });
    }

    res.json({
      success: true,
      message: 'Privacy policy activated successfully',
      data: privacyPolicy
    });
  } catch (error) {
    console.error('Error activating privacy policy:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while activating privacy policy'
    });
  }
});

// Delete privacy policy (admin only)
router.delete('/admin/delete/:id', requireAuth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'Admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }

    const { id } = req.params;

    const privacyPolicy = await PrivacyPolicy.findById(id);
    
    if (!privacyPolicy) {
      return res.status(404).json({
        success: false,
        message: 'Privacy policy not found'
      });
    }

    // Don't allow deletion of active policy
    if (privacyPolicy.isActive) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete active privacy policy. Please activate another policy first.'
      });
    }

    await PrivacyPolicy.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Privacy policy deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting privacy policy:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting privacy policy'
    });
  }
});

export default router;
