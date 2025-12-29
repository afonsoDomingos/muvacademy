import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        minlength: [2, 'Name must be at least 2 characters'],
        maxlength: [100, 'Name cannot exceed 100 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters'],
        select: false
    },
    phone: {
        type: String,
        trim: true,
        match: [/^(\+258)?[0-9]{9}$/, 'Please enter a valid Mozambique phone number']
    },
    role: {
        type: String,
        enum: ['cliente', 'admin', 'superadmin'],
        default: 'cliente'
    },
    avatar: {
        type: String,
        default: null
    },
    language: {
        type: String,
        enum: ['pt', 'en'],
        default: 'pt'
    },
    theme: {
        type: String,
        enum: ['dark', 'light'],
        default: 'dark'
    },
    bio: {
        type: String,
        maxlength: [500, 'Bio cannot exceed 500 characters'],
        default: ''
    },
    profession: {
        type: String,
        maxlength: [100, 'Profession cannot exceed 100 characters'],
        default: ''
    },
    location: {
        city: { type: String, default: '' },
        province: { type: String, default: '' }
    },
    socialLinks: {
        linkedin: { type: String, default: '' },
        github: { type: String, default: '' },
        website: { type: String, default: '' }
    },
    isActive: {
        type: Boolean,
        default: true
    },
    lastLogin: {
        type: Date,
        default: null
    },
    refreshToken: {
        type: String,
        select: false
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual for enrolled courses
userSchema.virtual('enrollments', {
    ref: 'Enrollment',
    localField: '_id',
    foreignField: 'userId'
});

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }

    try {
        const salt = await bcrypt.genSalt(12);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Get public profile (hide sensitive data)
userSchema.methods.getPublicProfile = function () {
    return {
        id: this._id,
        name: this.name,
        email: this.email,
        phone: this.phone,
        role: this.role,
        avatar: this.avatar,
        language: this.language,
        theme: this.theme,
        bio: this.bio,
        profession: this.profession,
        location: this.location,
        socialLinks: this.socialLinks,
        createdAt: this.createdAt
    };
};

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ createdAt: -1 });

const User = mongoose.model('User', userSchema);

export default User;
