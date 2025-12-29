import express from 'express';
import { getModulesByCourse, getModule, createModule, updateModule, deleteModule, reorderModules } from '../controllers/module.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { requireAdmin } from '../middleware/rbac.middleware.js';

const router = express.Router();

// Public
router.get('/course/:courseId', getModulesByCourse);
router.get('/:id', getModule);

// Admin
router.post('/', authenticate, requireAdmin, createModule);
router.put('/:id', authenticate, requireAdmin, updateModule);
router.delete('/:id', authenticate, requireAdmin, deleteModule);
router.patch('/reorder', authenticate, requireAdmin, reorderModules);

export default router;
