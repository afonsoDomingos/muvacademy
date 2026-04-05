import express from 'express';
import { 
    uploadCourseImageHandler, uploadAvatarHandler, uploadProofHandler, uploadMaterialHandler, deleteFile,
    uploadBannerHandler, uploadWorkshopHandler
} from '../controllers/upload.controller.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

// User uploads
router.post('/avatar', uploadAvatarHandler);
router.post('/proof', uploadProofHandler);

// Admin uploads
router.post('/course-image', admin, uploadCourseImageHandler);
router.post('/banner', admin, uploadBannerHandler);
router.post('/workshop', admin, uploadWorkshopHandler);
router.post('/material', admin, uploadMaterialHandler);
router.delete('/', admin, deleteFile);

export default router;
