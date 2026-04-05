import express from 'express';
import { createServiceRequest, getRequests, updateRequestStatus } from '../controllers/serviceRequest.controller.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// Public route to submit request
router.post('/', createServiceRequest);

// Admin routes
router.get('/', protect, admin, getRequests);
router.put('/:id', protect, admin, updateRequestStatus);

export default router;
