import express from 'express';
import { getWorkshops, createWorkshop, updateWorkshop, deleteWorkshop } from '../controllers/workshop.controller.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getWorkshops);
router.post('/', protect, admin, createWorkshop);
router.put('/:id', protect, admin, updateWorkshop);
router.delete('/:id', protect, admin, deleteWorkshop);

export default router;
