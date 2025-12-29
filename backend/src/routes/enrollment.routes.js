import express from 'express';
import { getMyEnrollments, getAllEnrollments, getEnrollment, createEnrollment, approveEnrollment, rejectEnrollment, updateProgress } from '../controllers/enrollment.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { requireAdmin } from '../middleware/rbac.middleware.js';

const router = express.Router();

router.use(authenticate);

// Student routes
router.get('/my', getMyEnrollments);
router.post('/', createEnrollment);
router.get('/:id', getEnrollment);
router.put('/:courseId/progress', updateProgress);

// Admin routes
router.get('/', requireAdmin, getAllEnrollments);
router.patch('/:id/approve', requireAdmin, approveEnrollment);
router.patch('/:id/reject', requireAdmin, rejectEnrollment);

export default router;
