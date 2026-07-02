import express from 'express';
import {
    getGalleryPhotos,
    getAllGalleryPhotos,
    createGalleryPhoto,
    updateGalleryPhoto,
    deleteGalleryPhoto
} from '../controllers/gallery.controller.js';
import { authenticate as protect } from '../middleware/auth.middleware.js';
import { requireAdmin as admin } from '../middleware/rbac.middleware.js';

const router = express.Router();

// Public route: get published photos
router.get('/', getGalleryPhotos);

// Admin routes
router.get('/admin/all', protect, admin, getAllGalleryPhotos);
router.post('/', protect, admin, createGalleryPhoto);
router.put('/:id', protect, admin, updateGalleryPhoto);
router.delete('/:id', protect, admin, deleteGalleryPhoto);

export default router;
