import express from 'express';
import { getCourses, getCourse, createCourse, updateCourse, deleteCourse, togglePublish, getCategories, getFeaturedCourses } from '../controllers/course.controller.js';
import { authenticate, optionalAuth } from '../middleware/auth.middleware.js';
import { requireAdmin, requireSuperAdmin } from '../middleware/rbac.middleware.js';

const router = express.Router();

// Public routes
router.get('/categories', getCategories);
router.get('/featured', getFeaturedCourses);
router.get('/', optionalAuth, getCourses);
router.get('/:identifier', optionalAuth, getCourse);

// Admin routes
router.post('/', authenticate, requireAdmin, createCourse);
router.put('/:id', authenticate, requireAdmin, updateCourse);
router.patch('/:id/publish', authenticate, requireAdmin, togglePublish);

// Superadmin and Admin
router.delete('/:id', authenticate, requireAdmin, deleteCourse);

export default router;
