import express from 'express';
import { 
    getHomeBanners, createBanner, updateBanner, deleteBanner,
    getAllServices, createService, updateService, deleteService
} from '../controllers/content.controller.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/banners', getHomeBanners);
router.get('/services', getAllServices);

// Admin routes
router.post('/banners', protect, admin, createBanner);
router.put('/banners/:id', protect, admin, updateBanner);
router.delete('/banners/:id', protect, admin, deleteBanner);

router.post('/services', protect, admin, createService);
router.put('/services/:id', protect, admin, updateService);
router.delete('/services/:id', protect, admin, deleteService);

export default router;
