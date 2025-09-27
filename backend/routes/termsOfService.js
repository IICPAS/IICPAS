import express from 'express';
import { 
  getActiveTermsOfService, 
  getAllTermsOfService, 
  getTermsOfServiceById,
  createTermsOfService, 
  updateTermsOfService, 
  activateTermsOfService, 
  deleteTermsOfService 
} from '../controllers/termsOfServiceController.js';
import { requireAuth } from '../middleware/requireAuth.js';

const router = express.Router();

// Public routes
router.get('/active', getActiveTermsOfService);

// Admin routes
router.get('/admin/all', requireAuth, getAllTermsOfService);
router.get('/admin/:id', requireAuth, getTermsOfServiceById);
router.post('/admin/create', requireAuth, createTermsOfService);
router.put('/admin/:id', requireAuth, updateTermsOfService);
router.put('/admin/:id/activate', requireAuth, activateTermsOfService);
router.delete('/admin/:id', requireAuth, deleteTermsOfService);

export default router;
