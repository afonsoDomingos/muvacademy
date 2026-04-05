import express from 'express';
import { 
    getHomeBanners, createBanner, updateBanner, deleteBanner,
    getAllServices, createService, updateService, deleteService,
    getSetting, updateSetting
} from '../controllers/content.controller.js';
import { authenticate as protect } from '../middleware/auth.middleware.js';
import { requireAdmin as admin } from '../middleware/rbac.middleware.js';


const router = express.Router();

// Public routes
router.get('/banners', getHomeBanners);
router.get('/services', getAllServices);
router.get('/settings/:key', getSetting);

// Admin routes
router.post('/banners', protect, admin, createBanner);
router.put('/banners/:id', protect, admin, updateBanner);
router.delete('/banners/:id', protect, admin, deleteBanner);

router.post('/services', protect, admin, createService);
router.put('/services/:id', protect, admin, updateService);
router.delete('/services/:id', protect, admin, deleteService);

router.put('/settings/:key', protect, admin, updateSetting);

export default router;
