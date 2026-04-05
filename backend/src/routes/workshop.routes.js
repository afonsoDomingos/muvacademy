import express from 'express';
import { getWorkshops, createWorkshop, updateWorkshop, deleteWorkshop } from '../controllers/workshop.controller.js';
import { authenticate as protect } from '../middleware/auth.middleware.js';
import { requireAdmin as admin } from '../middleware/rbac.middleware.js';


const router = express.Router();

router.get('/', getWorkshops);
router.post('/', protect, admin, createWorkshop);
router.put('/:id', protect, admin, updateWorkshop);
router.delete('/:id', protect, admin, deleteWorkshop);

export default router;
