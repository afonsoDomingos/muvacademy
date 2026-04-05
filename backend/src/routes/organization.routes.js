import express from 'express';
import { 
    getEmployees, promoteEmployee, 
    getTasks, createTask, updateTask, 
    getAdminOverview 
} from '../controllers/organization.controller.js';
import { 
    getFinances, createFinanceRecord,
    getProposals, createProposal, updateProposalStatus
} from '../controllers/finance_proposal.controller.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// --- DASHBOARD OVERVIEW ---
router.get('/overview', protect, getAdminOverview);

// --- EMPLOYEE MANAGEMENT ---
router.get('/employees', protect, admin, getEmployees);
router.put('/employees/:id/promote', protect, admin, promoteEmployee);

// --- TASKS MANAGEMENT ---
router.get('/tasks', protect, getTasks);
router.post('/tasks', protect, admin, createTask);
router.put('/tasks/:id', protect, updateTask);

// --- FINANCE ---
router.get('/finances', protect, admin, getFinances);
router.post('/finances', protect, admin, createFinanceRecord);

// --- PROPOSALS / TENDERS ---
router.get('/proposals', protect, getProposals);
router.post('/proposals', protect, admin, createProposal);
router.put('/proposals/:id/status', protect, admin, updateProposalStatus);

export default router;
