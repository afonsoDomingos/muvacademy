import User from '../models/User.js';
import Enrollment from '../models/Enrollment.js';
import Log from '../models/Log.js';

/**
 * @desc    Get all users (Admin/Superadmin)
 * @route   GET /api/users
 * @access  Private/Superadmin
 */
export const getUsers = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            role,
            search,
            isActive,
            sortBy = 'createdAt',
            sortOrder = 'desc'
        } = req.query;

        const query = {};

        // Filter by role
        if (role) {
            query.role = role;
        }

        // Filter by active status
        if (isActive !== undefined) {
            query.isActive = isActive === 'true';
        }

        // Search by name or email
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        // Sorting
        const sort = {};
        sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const [users, total] = await Promise.all([
            User.find(query)
                .select('-password -refreshToken')
                .sort(sort)
                .skip(skip)
                .limit(parseInt(limit)),
            User.countDocuments(query)
        ]);

        res.json({
            success: true,
            data: {
                users,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    pages: Math.ceil(total / parseInt(limit))
                }
            }
        });
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao buscar usuários.',
            code: 'GET_USERS_ERROR'
        });
    }
};

/**
 * @desc    Get single user by ID
 * @route   GET /api/users/:id
 * @access  Private/Superadmin
 */
export const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password -refreshToken');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuário não encontrado.',
                code: 'USER_NOT_FOUND'
            });
        }

        // Get enrollment stats
        const enrollmentStats = await Enrollment.aggregate([
            { $match: { userId: user._id } },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        res.json({
            success: true,
            data: {
                user: user.getPublicProfile(),
                enrollmentStats: enrollmentStats.reduce((acc, stat) => {
                    acc[stat._id] = stat.count;
                    return acc;
                }, {})
            }
        });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao buscar usuário.',
            code: 'GET_USER_ERROR'
        });
    }
};

/**
 * @desc    Create new user (Superadmin only)
 * @route   POST /api/users
 * @access  Private/Superadmin
 */
export const createUser = async (req, res) => {
    try {
        const { name, email, password, phone, role, language, isActive } = req.body;

        // Check if email exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Este email já está registrado.',
                code: 'EMAIL_EXISTS'
            });
        }

        const user = await User.create({
            name,
            email: email.toLowerCase(),
            password,
            phone,
            role: role || 'cliente',
            language: language || 'pt',
            isActive: isActive !== false
        });

        // Log action
        await Log.createLog({
            userId: req.user._id,
            action: 'user_create',
            description: `Superadmin created user: ${user.email} with role ${user.role}`,
            targetType: 'user',
            targetId: user._id,
            newData: { name, email, role },
            ip: req.ip,
            userAgent: req.headers['user-agent']
        });

        res.status(201).json({
            success: true,
            message: 'Usuário criado com sucesso!',
            data: {
                user: user.getPublicProfile()
            }
        });
    } catch (error) {
        console.error('Create user error:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao criar usuário.',
            code: 'CREATE_USER_ERROR'
        });
    }
};

/**
 * @desc    Update user (Superadmin only)
 * @route   PUT /api/users/:id
 * @access  Private/Superadmin
 */
export const updateUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuário não encontrado.',
                code: 'USER_NOT_FOUND'
            });
        }

        // Prevent superadmin from being demoted by another superadmin
        if (user.role === 'superadmin' && req.body.role !== 'superadmin' && user._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Não é possível alterar o role de outro superadmin.',
                code: 'CANNOT_MODIFY_SUPERADMIN'
            });
        }

        const previousData = {
            name: user.name,
            email: user.email,
            role: user.role,
            isActive: user.isActive
        };

        // Update allowed fields
        const allowedFields = ['name', 'email', 'phone', 'role', 'language', 'theme', 'bio', 'profession', 'location', 'socialLinks', 'isActive'];

        allowedFields.forEach(field => {
            if (req.body[field] !== undefined) {
                user[field] = req.body[field];
            }
        });

        // Update password if provided
        if (req.body.password) {
            user.password = req.body.password;
        }

        await user.save();

        // Log action
        await Log.createLog({
            userId: req.user._id,
            action: 'user_update',
            description: `Superadmin updated user: ${user.email}`,
            targetType: 'user',
            targetId: user._id,
            previousData,
            newData: {
                name: user.name,
                email: user.email,
                role: user.role,
                isActive: user.isActive
            },
            ip: req.ip,
            userAgent: req.headers['user-agent']
        });

        res.json({
            success: true,
            message: 'Usuário atualizado com sucesso!',
            data: {
                user: user.getPublicProfile()
            }
        });
    } catch (error) {
        console.error('Update user error:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao atualizar usuário.',
            code: 'UPDATE_USER_ERROR'
        });
    }
};

/**
 * @desc    Change user role (Superadmin only)
 * @route   PATCH /api/users/:id/role
 * @access  Private/Superadmin
 */
export const changeUserRole = async (req, res) => {
    try {
        const { role } = req.body;

        if (!['cliente', 'admin', 'superadmin'].includes(role)) {
            return res.status(400).json({
                success: false,
                message: 'Role inválido.',
                code: 'INVALID_ROLE'
            });
        }

        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuário não encontrado.',
                code: 'USER_NOT_FOUND'
            });
        }

        // Prevent self-demotion
        if (user._id.toString() === req.user._id.toString() && role !== 'superadmin') {
            return res.status(400).json({
                success: false,
                message: 'Você não pode rebaixar seu próprio role.',
                code: 'CANNOT_DEMOTE_SELF'
            });
        }

        const previousRole = user.role;
        user.role = role;
        await user.save();

        // Log role change
        await Log.createLog({
            userId: req.user._id,
            action: 'role_change',
            description: `Role changed for ${user.email}: ${previousRole} -> ${role}`,
            targetType: 'user',
            targetId: user._id,
            previousData: { role: previousRole },
            newData: { role },
            ip: req.ip,
            userAgent: req.headers['user-agent']
        });

        res.json({
            success: true,
            message: 'Role alterado com sucesso!',
            data: {
                user: user.getPublicProfile()
            }
        });
    } catch (error) {
        console.error('Change role error:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao alterar role.',
            code: 'CHANGE_ROLE_ERROR'
        });
    }
};

/**
 * @desc    Delete user (Superadmin only)
 * @route   DELETE /api/users/:id
 * @access  Private/Superadmin
 */
export const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuário não encontrado.',
                code: 'USER_NOT_FOUND'
            });
        }

        // Prevent self-deletion
        if (user._id.toString() === req.user._id.toString()) {
            return res.status(400).json({
                success: false,
                message: 'Você não pode deletar sua própria conta.',
                code: 'CANNOT_DELETE_SELF'
            });
        }

        // Prevent deleting other superadmins
        if (user.role === 'superadmin') {
            return res.status(403).json({
                success: false,
                message: 'Não é possível deletar outro superadmin.',
                code: 'CANNOT_DELETE_SUPERADMIN'
            });
        }

        await user.deleteOne();

        // Log deletion
        await Log.createLog({
            userId: req.user._id,
            action: 'user_delete',
            description: `User deleted: ${user.email}`,
            targetType: 'user',
            targetId: user._id,
            previousData: {
                name: user.name,
                email: user.email,
                role: user.role
            },
            ip: req.ip,
            userAgent: req.headers['user-agent']
        });

        res.json({
            success: true,
            message: 'Usuário deletado com sucesso!'
        });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao deletar usuário.',
            code: 'DELETE_USER_ERROR'
        });
    }
};

/**
 * @desc    Toggle user active status
 * @route   PATCH /api/users/:id/toggle-active
 * @access  Private/Superadmin
 */
export const toggleUserActive = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuário não encontrado.',
                code: 'USER_NOT_FOUND'
            });
        }

        // Prevent self-deactivation
        if (user._id.toString() === req.user._id.toString()) {
            return res.status(400).json({
                success: false,
                message: 'Você não pode desativar sua própria conta.',
                code: 'CANNOT_DEACTIVATE_SELF'
            });
        }

        user.isActive = !user.isActive;
        await user.save();

        res.json({
            success: true,
            message: user.isActive ? 'Usuário ativado!' : 'Usuário desativado!',
            data: {
                user: user.getPublicProfile()
            }
        });
    } catch (error) {
        console.error('Toggle active error:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao alterar status do usuário.',
            code: 'TOGGLE_ACTIVE_ERROR'
        });
    }
};
