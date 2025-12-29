import express from 'express';
import { getDashboardStats, getUserStats, getLogs } from '../controllers/stats.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { requireAdmin, requireSuperAdmin } from '../middleware/rbac.middleware.js';

const router = express.Router();

router.use(authenticate);

// Student stats
router.get('/user', getUserStats);

// Admin stats
router.get('/dashboard', requireAdmin, getDashboardStats);

// Superadmin only
router.get('/logs', requireSuperAdmin, getLogs);

export default router;
