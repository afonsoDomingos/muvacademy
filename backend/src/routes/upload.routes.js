import express from 'express';
import { uploadCourseImageHandler, uploadAvatarHandler, uploadProofHandler, uploadMaterialHandler, deleteFile } from '../controllers/upload.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { requireAdmin } from '../middleware/rbac.middleware.js';

const router = express.Router();

router.use(authenticate);

// User uploads
router.post('/avatar', uploadAvatarHandler);
router.post('/proof', uploadProofHandler);

// Admin uploads
router.post('/course-image', requireAdmin, uploadCourseImageHandler);
router.post('/material', requireAdmin, uploadMaterialHandler);
router.delete('/', requireAdmin, deleteFile);

export default router;
