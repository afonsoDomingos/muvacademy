import express from 'express';
import { 
    getEmployees, promoteEmployee, 
    getTasks, createTask, updateTask, 
    getAdminOverview 
} from '../controllers/organization.controller.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// --- DASHBOARD OVERVIEW ---
router.get('/overview', protect, admin, getAdminOverview);

// --- EMPLOYEE MANAGEMENT ---
router.get('/employees', protect, admin, getEmployees);
router.put('/employees/:id/promote', protect, admin, promoteEmployee);

// --- TASKS MANAGEMENT ---
router.get('/tasks', protect, getTasks);
router.post('/tasks', protect, admin, createTask);
router.put('/tasks/:id', protect, updateTask);

export default router;
