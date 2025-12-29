import mongoose from 'mongoose';

const moduleSchema = new mongoose.Schema({
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: [true, 'Course ID is required']
    },
    title: {
        pt: {
            type: String,
            required: [true, 'Portuguese title is required'],
            trim: true,
            maxlength: [200, 'Title cannot exceed 200 characters']
        },
        en: {
            type: String,
            required: [true, 'English title is required'],
            trim: true,
            maxlength: [200, 'Title cannot exceed 200 characters']
        }
    },
    description: {
        pt: {
            type: String,
            maxlength: [1000, 'Description cannot exceed 1000 characters'],
            default: ''
        },
        en: {
            type: String,
            maxlength: [1000, 'Description cannot exceed 1000 characters'],
            default: ''
        }
    },
    order: {
        type: Number,
        required: true,
        min: [1, 'Order must be at least 1']
    },
    isPublished: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual for lessons
moduleSchema.virtual('lessons', {
    ref: 'Lesson',
    localField: '_id',
    foreignField: 'moduleId'
});

// Get lessons count
moduleSchema.virtual('lessonsCount', {
    ref: 'Lesson',
    localField: '_id',
    foreignField: 'moduleId',
    count: true
});

// Ensure unique order within a course
moduleSchema.index({ courseId: 1, order: 1 }, { unique: true });

// Auto-assign order if not provided
moduleSchema.pre('save', async function (next) {
    if (this.isNew && !this.order) {
        const lastModule = await this.constructor.findOne({ courseId: this.courseId })
            .sort({ order: -1 });
        this.order = lastModule ? lastModule.order + 1 : 1;
    }
    next();
});

const Module = mongoose.model('Module', moduleSchema);

export default Module;
