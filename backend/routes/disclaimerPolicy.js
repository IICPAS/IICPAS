import express from 'express';
import { 
  getActiveDisclaimerPolicy, 
  getAllDisclaimerPolicies, 
  getDisclaimerPolicyById,
  createDisclaimerPolicy, 
  updateDisclaimerPolicy, 
  activateDisclaimerPolicy, 
  deleteDisclaimerPolicy 
} from '../controllers/disclaimerPolicyController.js';
import { requireAuth } from '../middleware/requireAuth.js';

const router = express.Router();

// Public routes
router.get('/active', getActiveDisclaimerPolicy);

// Admin routes
router.get('/admin/all', requireAuth, getAllDisclaimerPolicies);
router.get('/admin/:id', requireAuth, getDisclaimerPolicyById);
router.post('/admin/create', requireAuth, createDisclaimerPolicy);
router.put('/admin/update/:id', requireAuth, updateDisclaimerPolicy);
router.put('/admin/activate/:id', requireAuth, activateDisclaimerPolicy);
router.delete('/admin/delete/:id', requireAuth, deleteDisclaimerPolicy);

export default router;
