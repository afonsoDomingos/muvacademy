import mongoose from 'mongoose';

const bannerSchema = new mongoose.Schema({
    title: {
        pt: { type: String, required: true },
        en: { type: String, required: true }
    },
    subtitle: {
        pt: { type: String },
        en: { type: String }
    },
    ctaText: {
        pt: { type: String },
        en: { type: String }
    },
    ctaLink: { type: String },
    image: { type: String, required: true },
    order: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
    type: { type: String, enum: ['home', 'category'], default: 'home' },
    category: { type: String } // For category-specific banners
}, {
    timestamps: true
});

const Banner = mongoose.model('Banner', bannerSchema);

export default Banner;
