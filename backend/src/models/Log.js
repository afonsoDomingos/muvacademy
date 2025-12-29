import mongoose from 'mongoose';

const logSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    action: {
        type: String,
        required: true,
        enum: [
            // Auth actions
            'login',
            'logout',
            'register',
            'password_change',
            'password_reset',

            // User actions
            'user_create',
            'user_update',
            'user_delete',
            'role_change',

            // Course actions
            'course_create',
            'course_update',
            'course_delete',
            'course_publish',
            'course_unpublish',

            // Module/Lesson actions
            'module_create',
            'module_update',
            'module_delete',
            'lesson_create',
            'lesson_update',
            'lesson_delete',
            'material_add',
            'material_delete',

            // Enrollment actions
            'enrollment_create',
            'enrollment_approve',
            'enrollment_reject',
            'enrollment_cancel',

            // Progress actions
            'lesson_complete',
            'certificate_generate',

            // System actions
            'system_setting_change',
            'backup_create',
            'data_export'
        ]
    },
    description: {
        type: String,
        required: true
    },
    targetType: {
        type: String,
        enum: ['user', 'course', 'module', 'lesson', 'enrollment', 'material', 'system', null],
        default: null
    },
    targetId: {
        type: mongoose.Schema.Types.ObjectId,
        default: null
    },
    previousData: {
        type: mongoose.Schema.Types.Mixed,
        default: null
    },
    newData: {
        type: mongoose.Schema.Types.Mixed,
        default: null
    },
    ip: {
        type: String,
        default: null
    },
    userAgent: {
        type: String,
        default: null
    },
    status: {
        type: String,
        enum: ['success', 'failure', 'warning'],
        default: 'success'
    },
    errorMessage: {
        type: String,
        default: null
    }
}, {
    timestamps: true
});

// Indexes for efficient querying
logSchema.index({ userId: 1, createdAt: -1 });
logSchema.index({ action: 1, createdAt: -1 });
logSchema.index({ targetType: 1, targetId: 1 });
logSchema.index({ createdAt: -1 });

// Static method for easy logging
logSchema.statics.createLog = async function (data) {
    try {
        return await this.create(data);
    } catch (error) {
        console.error('Failed to create log:', error);
        return null;
    }
};

// Auto-delete logs older than 90 days (optional)
logSchema.index({ createdAt: 1 }, { expireAfterSeconds: 90 * 24 * 60 * 60 });

const Log = mongoose.model('Log', logSchema);

export default Log;
