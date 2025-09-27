import express from 'express';
import { 
  getActiveTermsAndConditions, 
  getAllTermsAndConditions, 
  getTermsAndConditionsById,
  createTermsAndConditions, 
  updateTermsAndConditions, 
  activateTermsAndConditions, 
  deleteTermsAndConditions 
} from '../controllers/termsAndConditionsController.js';
import { requireAuth } from '../middleware/requireAuth.js';

const router = express.Router();

// Public routes
router.get('/active', getActiveTermsAndConditions);

// Admin routes
router.get('/admin/all', requireAuth, getAllTermsAndConditions);
router.get('/admin/:id', requireAuth, getTermsAndConditionsById);
router.post('/admin/create', requireAuth, createTermsAndConditions);
router.put('/admin/update/:id', requireAuth, updateTermsAndConditions);
router.put('/admin/activate/:id', requireAuth, activateTermsAndConditions);
router.delete('/admin/delete/:id', requireAuth, deleteTermsAndConditions);

export default router;
