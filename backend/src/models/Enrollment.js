import mongoose from 'mongoose';

// Progress tracking for each lesson
const lessonProgressSchema = new mongoose.Schema({
    lessonId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lesson',
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    completedAt: {
        type: Date,
        default: null
    },
    watchTime: {
        type: Number, // in seconds
        default: 0
    },
    lastPosition: {
        type: Number, // video position in seconds
        default: 0
    }
}, { _id: false });

const enrollmentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required']
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: [true, 'Course ID is required']
    },
    status: {
        type: String,
        enum: ['PENDENTE', 'APROVADO', 'REJEITADO', 'CANCELADO', 'EXPIRADO'],
        default: 'PENDENTE'
    },
    proofUrl: {
        type: String,
        required: [true, 'Payment proof is required']
    },
    proofPublicId: {
        type: String,
        default: null
    },
    paymentMethod: {
        type: String,
        enum: ['transferencia', 'deposito', 'mpesa', 'emola', 'outro'],
        required: true
    },
    paymentDetails: {
        transactionId: { type: String },
        amount: { type: Number },
        currency: { type: String, enum: ['MZN', 'USD'], default: 'MZN' },
        paymentDate: { type: Date }
    },
    observations: {
        type: String,
        maxlength: [1000, 'Observations cannot exceed 1000 characters'],
        default: ''
    },
    adminNotes: {
        type: String,
        maxlength: [1000, 'Admin notes cannot exceed 1000 characters'],
        default: ''
    },
    approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    approvedAt: {
        type: Date,
        default: null
    },
    rejectedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    rejectedAt: {
        type: Date,
        default: null
    },
    rejectionReason: {
        type: String,
        default: ''
    },
    progress: [lessonProgressSchema],
    overallProgress: {
        type: Number, // percentage 0-100
        default: 0
    },
    startedAt: {
        type: Date,
        default: null
    },
    completedAt: {
        type: Date,
        default: null
    },
    certificateIssuedAt: {
        type: Date,
        default: null
    },
    certificateUrl: {
        type: String,
        default: null
    },
    expiresAt: {
        type: Date,
        default: null
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual for user
enrollmentSchema.virtual('user', {
    ref: 'User',
    localField: 'userId',
    foreignField: '_id',
    justOne: true
});

// Virtual for course
enrollmentSchema.virtual('course', {
    ref: 'Course',
    localField: 'courseId',
    foreignField: '_id',
    justOne: true
});

// Prevent duplicate enrollments
enrollmentSchema.index({ userId: 1, courseId: 1 }, { unique: true });

// Index for status queries
enrollmentSchema.index({ status: 1 });
enrollmentSchema.index({ userId: 1, status: 1 });
enrollmentSchema.index({ courseId: 1, status: 1 });
enrollmentSchema.index({ createdAt: -1 });

// Update overall progress
enrollmentSchema.methods.updateProgress = async function () {
    const Lesson = mongoose.model('Lesson');
    const Module = mongoose.model('Module');

    // Get all modules for the course
    const modules = await Module.find({ courseId: this.courseId });
    const moduleIds = modules.map(m => m._id);

    // Get all lessons for those modules
    const lessons = await Lesson.find({ moduleId: { $in: moduleIds } });
    const totalLessons = lessons.length;

    if (totalLessons === 0) {
        this.overallProgress = 0;
        return;
    }

    const completedLessons = this.progress.filter(p => p.completed).length;
    this.overallProgress = Math.round((completedLessons / totalLessons) * 100);

    // Check if course is completed
    if (this.overallProgress === 100 && !this.completedAt) {
        this.completedAt = new Date();
    }
};

// Middleware to update course enrollment count on approve
enrollmentSchema.post('save', async function (doc) {
    if (doc.status === 'APROVADO') {
        const Course = mongoose.model('Course');
        const count = await this.constructor.countDocuments({
            courseId: doc.courseId,
            status: 'APROVADO'
        });
        await Course.findByIdAndUpdate(doc.courseId, { enrollmentCount: count });
    }
});

const Enrollment = mongoose.model('Enrollment', enrollmentSchema);

export default Enrollment;
