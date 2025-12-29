import express from 'express';
import { getUsers, getUser, createUser, updateUser, deleteUser, changeUserRole, toggleUserActive } from '../controllers/user.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { requireSuperAdmin } from '../middleware/rbac.middleware.js';

const router = express.Router();

// All routes require superadmin
router.use(authenticate);
router.use(requireSuperAdmin);

router.get('/', getUsers);
router.get('/:id', getUser);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);
router.patch('/:id/role', changeUserRole);
router.patch('/:id/toggle-active', toggleUserActive);

export default router;
