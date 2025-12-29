/**
 * Role-Based Access Control (RBAC) Middleware
 * 
 * Roles hierarchy:
 * - superadmin > admin > cliente
 * 
 * superadmin: Full access to everything
 * admin: Manage courses, enrollments, materials (not users)
 * cliente: Access to enrolled courses only
 */

// Role hierarchy for permission inheritance
const roleHierarchy = {
    superadmin: ['superadmin', 'admin', 'cliente'],
    admin: ['admin', 'cliente'],
    cliente: ['cliente']
};

/**
 * Check if user has required role
 * @param  {...string} allowedRoles - Roles that are allowed access
 */
export const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required.',
                code: 'AUTH_REQUIRED'
            });
        }

        const userRole = req.user.role;

        // Check if user's role or any role they inherit gives access
        const hasAccess = allowedRoles.some(role =>
            roleHierarchy[userRole]?.includes(role)
        );

        if (!hasAccess) {
            return res.status(403).json({
                success: false,
                message: 'You do not have permission to perform this action.',
                code: 'FORBIDDEN',
                requiredRoles: allowedRoles,
                userRole: userRole
            });
        }

        next();
    };
};

/**
 * Require admin or superadmin role
 */
export const requireAdmin = authorize('admin', 'superadmin');

/**
 * Require superadmin role only
 */
export const requireSuperAdmin = authorize('superadmin');

/**
 * Require cliente role (any authenticated user)
 */
export const requireCliente = authorize('cliente', 'admin', 'superadmin');

/**
 * Check if user owns the resource or is admin
 * @param {Function} getResourceOwnerId - Function to extract owner ID from request
 */
export const authorizeOwnerOrAdmin = (getResourceOwnerId) => {
    return async (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required.',
                code: 'AUTH_REQUIRED'
            });
        }

        // Admins and superadmins have access
        if (['admin', 'superadmin'].includes(req.user.role)) {
            return next();
        }

        try {
            const ownerId = await getResourceOwnerId(req);

            if (!ownerId) {
                return res.status(404).json({
                    success: false,
                    message: 'Resource not found.',
                    code: 'NOT_FOUND'
                });
            }

            // Check if user is the owner
            if (ownerId.toString() === req.user._id.toString()) {
                return next();
            }

            return res.status(403).json({
                success: false,
                message: 'You do not have permission to access this resource.',
                code: 'FORBIDDEN'
            });
        } catch (error) {
            console.error('Authorization error:', error);
            return res.status(500).json({
                success: false,
                message: 'Authorization check failed.',
                code: 'AUTH_CHECK_ERROR'
            });
        }
    };
};

/**
 * Middleware to check if user can manage another user
 * Only superadmin can manage admins
 * Admins can only manage clients
 */
export const canManageUser = async (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: 'Authentication required.',
            code: 'AUTH_REQUIRED'
        });
    }

    // Only superadmin can manage users
    if (req.user.role !== 'superadmin') {
        return res.status(403).json({
            success: false,
            message: 'Only superadmin can manage users.',
            code: 'FORBIDDEN'
        });
    }

    next();
};

/**
 * Check enrollment access
 * User can only access their own enrollments unless admin
 */
export const checkEnrollmentAccess = async (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: 'Authentication required.',
            code: 'AUTH_REQUIRED'
        });
    }

    // Admins have full access
    if (['admin', 'superadmin'].includes(req.user.role)) {
        return next();
    }

    // For clients, ensure they can only access their own data
    const { userId } = req.params;

    if (userId && userId !== req.user._id.toString()) {
        return res.status(403).json({
            success: false,
            message: 'You can only access your own enrollments.',
            code: 'FORBIDDEN'
        });
    }

    next();
};
