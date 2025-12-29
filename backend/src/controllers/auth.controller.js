import User from '../models/User.js';
import Log from '../models/Log.js';
import {
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken
} from '../middleware/auth.middleware.js';

/**
 * @desc    Register new user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = async (req, res) => {
    try {
        const { name, email, password, phone, language } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Este email já está registrado.',
                code: 'EMAIL_EXISTS'
            });
        }

        // Create user (always as 'cliente' role by default)
        const user = await User.create({
            name,
            email: email.toLowerCase(),
            password,
            phone,
            language: language || 'pt',
            role: 'cliente'
        });

        // Generate tokens
        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        // Save refresh token
        user.refreshToken = refreshToken;
        await user.save();

        // Log the registration
        await Log.createLog({
            userId: user._id,
            action: 'register',
            description: `New user registered: ${user.email}`,
            targetType: 'user',
            targetId: user._id,
            ip: req.ip,
            userAgent: req.headers['user-agent']
        });

        res.status(201).json({
            success: true,
            message: 'Registro realizado com sucesso!',
            data: {
                user: user.getPublicProfile(),
                accessToken,
                refreshToken
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao registrar usuário.',
            code: 'REGISTRATION_ERROR'
        });
    }
};

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user and include password for verification
        const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Email ou senha inválidos.',
                code: 'INVALID_CREDENTIALS'
            });
        }

        // Check if user is active
        if (!user.isActive) {
            return res.status(401).json({
                success: false,
                message: 'Sua conta está desativada. Entre em contato com o suporte.',
                code: 'ACCOUNT_INACTIVE'
            });
        }

        // Verify password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Email ou senha inválidos.',
                code: 'INVALID_CREDENTIALS'
            });
        }

        // Generate tokens
        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        // Update user
        user.refreshToken = refreshToken;
        user.lastLogin = new Date();
        await user.save();

        // Log the login
        await Log.createLog({
            userId: user._id,
            action: 'login',
            description: `User logged in: ${user.email}`,
            targetType: 'user',
            targetId: user._id,
            ip: req.ip,
            userAgent: req.headers['user-agent']
        });

        res.json({
            success: true,
            message: 'Login realizado com sucesso!',
            data: {
                user: user.getPublicProfile(),
                accessToken,
                refreshToken
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao fazer login.',
            code: 'LOGIN_ERROR'
        });
    }
};

/**
 * @desc    Refresh access token
 * @route   POST /api/auth/refresh
 * @access  Public
 */
export const refreshToken = async (req, res) => {
    try {
        const { refreshToken: token } = req.body;

        if (!token) {
            return res.status(400).json({
                success: false,
                message: 'Refresh token é obrigatório.',
                code: 'NO_REFRESH_TOKEN'
            });
        }

        // Verify refresh token
        let decoded;
        try {
            decoded = verifyRefreshToken(token);
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: 'Refresh token inválido ou expirado.',
                code: 'INVALID_REFRESH_TOKEN'
            });
        }

        // Find user
        const user = await User.findById(decoded.id).select('+refreshToken');

        if (!user || user.refreshToken !== token) {
            return res.status(401).json({
                success: false,
                message: 'Refresh token inválido.',
                code: 'INVALID_REFRESH_TOKEN'
            });
        }

        // Generate new tokens
        const newAccessToken = generateAccessToken(user._id);
        const newRefreshToken = generateRefreshToken(user._id);

        // Update refresh token
        user.refreshToken = newRefreshToken;
        await user.save();

        res.json({
            success: true,
            data: {
                accessToken: newAccessToken,
                refreshToken: newRefreshToken
            }
        });
    } catch (error) {
        console.error('Refresh token error:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao atualizar token.',
            code: 'REFRESH_ERROR'
        });
    }
};

/**
 * @desc    Logout user
 * @route   POST /api/auth/logout
 * @access  Private
 */
export const logout = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.refreshToken = null;
            await user.save();

            // Log the logout
            await Log.createLog({
                userId: user._id,
                action: 'logout',
                description: `User logged out: ${user.email}`,
                targetType: 'user',
                targetId: user._id,
                ip: req.ip,
                userAgent: req.headers['user-agent']
            });
        }

        res.json({
            success: true,
            message: 'Logout realizado com sucesso!'
        });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao fazer logout.',
            code: 'LOGOUT_ERROR'
        });
    }
};

/**
 * @desc    Get current user profile
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        res.json({
            success: true,
            data: {
                user: user.getPublicProfile()
            }
        });
    } catch (error) {
        console.error('Get me error:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao buscar perfil.',
            code: 'GET_PROFILE_ERROR'
        });
    }
};

/**
 * @desc    Update current user profile
 * @route   PUT /api/auth/me
 * @access  Private
 */
export const updateMe = async (req, res) => {
    try {
        const allowedFields = [
            'name', 'phone', 'bio', 'profession',
            'location', 'socialLinks', 'language', 'theme'
        ];

        const updates = {};
        allowedFields.forEach(field => {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        });

        const user = await User.findByIdAndUpdate(
            req.user._id,
            updates,
            { new: true, runValidators: true }
        );

        res.json({
            success: true,
            message: 'Perfil atualizado com sucesso!',
            data: {
                user: user.getPublicProfile()
            }
        });
    } catch (error) {
        console.error('Update me error:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao atualizar perfil.',
            code: 'UPDATE_PROFILE_ERROR'
        });
    }
};

/**
 * @desc    Change password
 * @route   PUT /api/auth/password
 * @access  Private
 */
export const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        const user = await User.findById(req.user._id).select('+password');

        // Verify current password
        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: 'Senha atual incorreta.',
                code: 'WRONG_PASSWORD'
            });
        }

        // Update password
        user.password = newPassword;
        await user.save();

        // Log password change
        await Log.createLog({
            userId: user._id,
            action: 'password_change',
            description: `User changed password: ${user.email}`,
            targetType: 'user',
            targetId: user._id,
            ip: req.ip,
            userAgent: req.headers['user-agent']
        });

        res.json({
            success: true,
            message: 'Senha alterada com sucesso!'
        });
    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({
            success: false,
            message: 'Erro ao alterar senha.',
            code: 'CHANGE_PASSWORD_ERROR'
        });
    }
};
