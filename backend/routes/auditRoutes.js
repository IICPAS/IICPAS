import express from 'express';
import {
  trackActivity,
  getAuditActivities,
  getAuditStats,
  getUserActivitySummary,
  getIPActivitySummary,
  deleteAuditActivities
} from '../controllers/auditController.js';
import { requireAuth } from '../middleware/requireAuth.js';
import { isAdmin } from '../middleware/isAdmin.js';

const router = express.Router();

// Public route for tracking activities (no auth required)
router.post('/track', trackActivity);

// Protected routes (admin only)
router.get('/activities', requireAuth, isAdmin, getAuditActivities);
router.get('/stats', requireAuth, isAdmin, getAuditStats);
router.get('/user/:userId/summary/:days', requireAuth, isAdmin, getUserActivitySummary);
router.get('/user/:userId/summary', requireAuth, isAdmin, getUserActivitySummary);
router.get('/ip/:ip/summary/:days', requireAuth, isAdmin, getIPActivitySummary);
router.get('/ip/:ip/summary', requireAuth, isAdmin, getIPActivitySummary);
router.delete('/activities', requireAuth, isAdmin, deleteAuditActivities);

export default router;
