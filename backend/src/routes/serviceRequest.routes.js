import express from 'express';
import { createServiceRequest, getRequests, updateRequestStatus, getMyRequests } from '../controllers/serviceRequest.controller.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// Public/User routes
router.post('/', createServiceRequest);
router.get('/my', protect, getMyRequests);

// Admin routes
router.get('/', protect, admin, getRequests);
router.put('/:id', protect, admin, updateRequestStatus);

export default router;
