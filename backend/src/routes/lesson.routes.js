import express from 'express';
import { getLessonsByModule, getLesson, createLesson, updateLesson, deleteLesson, addMaterial, removeMaterial, markComplete } from '../controllers/lesson.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { requireAdmin } from '../middleware/rbac.middleware.js';

const router = express.Router();

// Public
router.get('/module/:moduleId', getLessonsByModule);

// Authenticated
router.get('/:id', authenticate, getLesson);
router.post('/:id/complete', authenticate, markComplete);

// Admin
router.post('/', authenticate, requireAdmin, createLesson);
router.put('/:id', authenticate, requireAdmin, updateLesson);
router.delete('/:id', authenticate, requireAdmin, deleteLesson);
router.post('/:id/materials', authenticate, requireAdmin, addMaterial);
router.delete('/:id/materials/:materialId', authenticate, requireAdmin, removeMaterial);

export default router;
