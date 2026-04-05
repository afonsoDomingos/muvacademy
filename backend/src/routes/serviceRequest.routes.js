import express from 'express';
import { createServiceRequest, getRequests, updateRequestStatus, getMyRequests } from '../controllers/serviceRequest.controller.js';
import { authenticate as protect } from '../middleware/auth.middleware.js';
import { requireAdmin as admin } from '../middleware/rbac.middleware.js';


const router = express.Router();

// Public/User routes
router.post('/', createServiceRequest);
router.get('/my', protect, getMyRequests);

// Admin routes
router.get('/', protect, admin, getRequests);
router.put('/:id', protect, admin, updateRequestStatus);

export default router;
