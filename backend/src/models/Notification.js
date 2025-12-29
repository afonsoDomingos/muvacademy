import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required']
    },
    type: {
        type: String,
        enum: [
            'enrollment_approved',
            'enrollment_rejected',
            'new_material',
            'course_update',
            'certificate_ready',
            'payment_reminder',
            'system',
            'admin_message'
        ],
        required: true
    },
    title: {
        pt: { type: String, required: true },
        en: { type: String, required: true }
    },
    message: {
        pt: { type: String, required: true },
        en: { type: String, required: true }
    },
    read: {
        type: Boolean,
        default: false
    },
    readAt: {
        type: Date,
        default: null
    },
    data: {
        courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
        enrollmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Enrollment' },
        lessonId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' },
        link: { type: String },
        extra: { type: mongoose.Schema.Types.Mixed }
    },
    priority: {
        type: String,
        enum: ['low', 'normal', 'high', 'urgent'],
        default: 'normal'
    },
    expiresAt: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
});

// Indexes
notificationSchema.index({ userId: 1, read: 1 });
notificationSchema.index({ userId: 1, createdAt: -1 });
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Static method to create enrollment notifications
notificationSchema.statics.createEnrollmentNotification = async function (userId, type, courseTitle, data = {}) {
    const templates = {
        enrollment_approved: {
            title: {
                pt: '✅ Inscrição Aprovada!',
                en: '✅ Enrollment Approved!'
            },
            message: {
                pt: `Parabéns! Sua inscrição no curso "${courseTitle.pt}" foi aprovada. Você já pode começar a estudar!`,
                en: `Congratulations! Your enrollment in the course "${courseTitle.en}" has been approved. You can start learning now!`
            }
        },
        enrollment_rejected: {
            title: {
                pt: '❌ Inscrição Rejeitada',
                en: '❌ Enrollment Rejected'
            },
            message: {
                pt: `Sua inscrição no curso "${courseTitle.pt}" foi rejeitada. ${data.reason || 'Entre em contato para mais informações.'}`,
                en: `Your enrollment in the course "${courseTitle.en}" has been rejected. ${data.reason || 'Please contact us for more information.'}`
            }
        }
    };

    const template = templates[type];
    if (!template) return null;

    return await this.create({
        userId,
        type,
        title: template.title,
        message: template.message,
        data,
        priority: type === 'enrollment_approved' ? 'high' : 'normal'
    });
};

// Static method to create material notification
notificationSchema.statics.createMaterialNotification = async function (userId, courseTitle, lessonTitle, data = {}) {
    return await this.create({
        userId,
        type: 'new_material',
        title: {
            pt: '📚 Novo Material Disponível',
            en: '📚 New Material Available'
        },
        message: {
            pt: `Um novo material foi adicionado à aula "${lessonTitle.pt}" do curso "${courseTitle.pt}".`,
            en: `New material has been added to lesson "${lessonTitle.en}" in course "${courseTitle.en}".`
        },
        data,
        priority: 'normal'
    });
};

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;
