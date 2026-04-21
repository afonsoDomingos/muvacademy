import express from 'express';
import { 
    uploadCourseImageHandler, uploadAvatarHandler, uploadProofHandler, uploadMaterialHandler, deleteFile,
    uploadBannerHandler, uploadWorkshopHandler, uploadProductHandler
} from '../controllers/upload.controller.js';
import { authenticate as protect } from '../middleware/auth.middleware.js';
import { requireAdmin as admin } from '../middleware/rbac.middleware.js';


const router = express.Router();

router.use(protect);

// User uploads
router.post('/avatar', uploadAvatarHandler);
router.post('/proof', uploadProofHandler);

// Admin uploads
router.post('/course-image', admin, uploadCourseImageHandler);
router.post('/banner', admin, uploadBannerHandler);
router.post('/workshop', admin, uploadWorkshopHandler);
router.post('/product', admin, uploadProductHandler);
router.post('/material', admin, uploadMaterialHandler);
router.delete('/', admin, deleteFile);

export default router;
