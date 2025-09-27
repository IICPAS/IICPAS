import express from 'express';
import { 
  getActiveRefundPolicy, 
  getAllRefundPolicies, 
  createRefundPolicy, 
  updateRefundPolicy, 
  activateRefundPolicy, 
  deleteRefundPolicy 
} from '../controllers/refundPolicyController.js';
import { requireAuth } from '../middleware/requireAuth.js';

const router = express.Router();

// Public routes
router.get('/active', getActiveRefundPolicy);

// Admin routes
router.get('/admin/all', requireAuth, getAllRefundPolicies);
router.post('/admin/create', requireAuth, createRefundPolicy);
router.put('/admin/update/:id', requireAuth, updateRefundPolicy);
router.put('/admin/activate/:id', requireAuth, activateRefundPolicy);
router.delete('/admin/delete/:id', requireAuth, deleteRefundPolicy);

export default router;
