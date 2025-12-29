import mongoose from 'mongoose';

// Material subdocument schema
const materialSchema = new mongoose.Schema({
    title: {
        pt: { type: String, required: true, trim: true },
        en: { type: String, required: true, trim: true }
    },
    description: {
        pt: { type: String, default: '' },
        en: { type: String, default: '' }
    },
    type: {
        type: String,
        enum: ['upload', 'url'],
        required: true
    },
    fileType: {
        type: String,
        enum: ['video', 'pdf', 'image', 'document', 'other'],
        required: true
    },
    fileUrl: {
        type: String,
        required: true
    },
    cloudinaryPublicId: {
        type: String,
        default: null
    },
    mimeType: {
        type: String,
        default: null
    },
    fileSize: {
        type: Number, // in bytes
        default: null
    },
    duration: {
        hours: { type: Number, default: 0 },
        minutes: { type: Number, default: 0 },
        seconds: { type: Number, default: 0 }
    },
    isDownloadable: {
        type: Boolean,
        default: true
    },
    order: {
        type: Number,
        default: 1
    }
}, { timestamps: true });

const lessonSchema = new mongoose.Schema({
    moduleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Module',
        required: [true, 'Module ID is required']
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
            maxlength: [2000, 'Description cannot exceed 2000 characters'],
            default: ''
        },
        en: {
            type: String,
            maxlength: [2000, 'Description cannot exceed 2000 characters'],
            default: ''
        }
    },
    order: {
        type: Number,
        required: true,
        min: [1, 'Order must be at least 1']
    },
    materials: [materialSchema],
    duration: {
        hours: { type: Number, default: 0 },
        minutes: { type: Number, default: 0 }
    },
    isFree: {
        type: Boolean,
        default: false
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

// Ensure unique order within a module
lessonSchema.index({ moduleId: 1, order: 1 }, { unique: true });

// Auto-assign order if not provided
lessonSchema.pre('save', async function (next) {
    if (this.isNew && !this.order) {
        const lastLesson = await this.constructor.findOne({ moduleId: this.moduleId })
            .sort({ order: -1 });
        this.order = lastLesson ? lastLesson.order + 1 : 1;
    }
    next();
});

// Calculate total duration from materials
lessonSchema.methods.calculateDuration = function () {
    let totalSeconds = 0;

    this.materials.forEach(material => {
        if (material.duration) {
            totalSeconds += (material.duration.hours || 0) * 3600 +
                (material.duration.minutes || 0) * 60 +
                (material.duration.seconds || 0);
        }
    });

    this.duration = {
        hours: Math.floor(totalSeconds / 3600),
        minutes: Math.floor((totalSeconds % 3600) / 60)
    };
};

const Lesson = mongoose.model('Lesson', lessonSchema);

export default Lesson;
