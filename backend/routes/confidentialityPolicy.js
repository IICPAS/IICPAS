import express from 'express';
import { 
  getActiveConfidentialityPolicy, 
  getAllConfidentialityPolicies, 
  getConfidentialityPolicyById,
  createConfidentialityPolicy, 
  updateConfidentialityPolicy, 
  activateConfidentialityPolicy, 
  deleteConfidentialityPolicy 
} from '../controllers/confidentialityPolicyController.js';
import { requireAuth } from '../middleware/requireAuth.js';

const router = express.Router();

// Public routes
router.get('/active', getActiveConfidentialityPolicy);

// Admin routes
router.get('/admin/all', requireAuth, getAllConfidentialityPolicies);
router.get('/admin/:id', requireAuth, getConfidentialityPolicyById);
router.post('/admin/create', requireAuth, createConfidentialityPolicy);
router.put('/admin/update/:id', requireAuth, updateConfidentialityPolicy);
router.put('/admin/activate/:id', requireAuth, activateConfidentialityPolicy);
router.delete('/admin/delete/:id', requireAuth, deleteConfidentialityPolicy);

export default router;
