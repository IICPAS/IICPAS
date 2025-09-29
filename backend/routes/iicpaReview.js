import express from 'express';
import { 
  getActiveIICPAReview, 
  getAllIICPAReviews, 
  getIICPAReviewById,
  createIICPAReview, 
  updateIICPAReview, 
  activateIICPAReview, 
  deleteIICPAReview 
} from '../controllers/iicpaReviewController.js';
import { requireAuth } from '../middleware/requireAuth.js';

const router = express.Router();

// Public routes
router.get('/active', getActiveIICPAReview);

// Admin routes
router.get('/admin/all', requireAuth, getAllIICPAReviews);
router.get('/admin/:id', requireAuth, getIICPAReviewById);
router.post('/admin/create', requireAuth, createIICPAReview);
router.put('/admin/update/:id', requireAuth, updateIICPAReview);
router.put('/admin/activate/:id', requireAuth, activateIICPAReview);
router.delete('/admin/delete/:id', requireAuth, deleteIICPAReview);

export default router;
