import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
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
    slug: {
        type: String,
        unique: true,
        lowercase: true
    },
    description: {
        pt: {
            type: String,
            required: [true, 'Portuguese description is required'],
            maxlength: [5000, 'Description cannot exceed 5000 characters']
        },
        en: {
            type: String,
            required: [true, 'English description is required'],
            maxlength: [5000, 'Description cannot exceed 5000 characters']
        }
    },
    shortDescription: {
        pt: {
            type: String,
            maxlength: [300, 'Short description cannot exceed 300 characters']
        },
        en: {
            type: String,
            maxlength: [300, 'Short description cannot exceed 300 characters']
        }
    },
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Instructor is required']
    },
    image: {
        type: String,
        default: null
    },
    priceMZN: {
        type: Number,
        required: [true, 'Price in MZN is required'],
        min: [0, 'Price cannot be negative']
    },
    priceUSD: {
        type: Number,
        required: [true, 'Price in USD is required'],
        min: [0, 'Price cannot be negative']
    },
    discountMZN: {
        type: Number,
        default: 0,
        min: [0, 'Discount cannot be negative']
    },
    discountUSD: {
        type: Number,
        default: 0,
        min: [0, 'Discount cannot be negative']
    },
    pricingOptions: [{
        title: {
            pt: { type: String, required: true },
            en: { type: String, required: true }
        },
        priceMZN: { type: Number, required: true },
        priceUSD: { type: Number, required: true },
        description: {
            pt: String,
            en: String
        }
    }],
    categories: [{
        type: String,
        enum: [
            'engenharia-civil',
            'engenharia-mecanica',
            'engenharia-eletrica',
            'engenharia-informatica',
            'arquitetura',
            'gestao-projetos',
            'seguranca-trabalho',
            'autocad',
            'bim-revit',
            'excel-avancado',
            'programacao',
            'redes',
            'energia-renovavel',
            'consultoria',
            'gestao',
            'geoprocessamento',
            'energia-sustentabilidade',
            'software',
            'outros'
        ]
    }],
    level: {
        type: String,
        enum: ['iniciante', 'intermediario', 'avancado', 'todos'],
        default: 'todos'
    },
    language: {
        type: String,
        enum: ['pt', 'en', 'both'],
        default: 'pt'
    },
    duration: {
        hours: { type: Number, default: 0 },
        minutes: { type: Number, default: 0 }
    },
    requirements: {
        pt: [{ type: String }],
        en: [{ type: String }]
    },
    objectives: {
        pt: [{ type: String }],
        en: [{ type: String }]
    },
    targetAudience: {
        pt: [{ type: String }],
        en: [{ type: String }]
    },
    certificate: {
        type: Boolean,
        default: true
    },
    certificateTemplate: {
        type: String,
        default: null
    },
    published: {
        type: Boolean,
        default: false
    },
    featured: {
        type: Boolean,
        default: false
    },
    rating: {
        average: { type: Number, default: 0, min: 0, max: 5 },
        count: { type: Number, default: 0 }
    },
    enrollmentCount: {
        type: Number,
        default: 0
    },
    tags: [{
        type: String,
        trim: true
    }],
    paymentInfo: {
        bankName: { type: String, default: 'Millennium BIM' },
        accountNumber: { type: String },
        accountName: { type: String },
        nuit: { type: String },
        mpesaNumber: { type: String },
        emolNumber: { type: String }
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual for modules
courseSchema.virtual('modules', {
    ref: 'Module',
    localField: '_id',
    foreignField: 'courseId'
});

// Generate slug before saving
courseSchema.pre('save', function (next) {
    if (this.isModified('title')) {
        this.slug = this.title.pt
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '') + '-' + Date.now();
    }
    next();
});

// Calculate total duration from modules/lessons
courseSchema.methods.calculateDuration = async function () {
    const Module = mongoose.model('Module');
    const Lesson = mongoose.model('Lesson');

    const modules = await Module.find({ courseId: this._id });
    let totalMinutes = 0;

    for (const module of modules) {
        const lessons = await Lesson.find({ moduleId: module._id });
        lessons.forEach(lesson => {
            totalMinutes += (lesson.duration?.hours || 0) * 60 + (lesson.duration?.minutes || 0);
        });
    }

    this.duration = {
        hours: Math.floor(totalMinutes / 60),
        minutes: totalMinutes % 60
    };

    await this.save();
};

// Indexes
courseSchema.index({ slug: 1 });
courseSchema.index({ published: 1 });
courseSchema.index({ categories: 1 });
courseSchema.index({ instructor: 1 });
courseSchema.index({ featured: 1 });
courseSchema.index({ 'title.pt': 'text', 'title.en': 'text', 'description.pt': 'text', 'description.en': 'text' });

const Course = mongoose.model('Course', courseSchema);

export default Course;
