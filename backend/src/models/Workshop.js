import mongoose from 'mongoose';

const workshopSchema = new mongoose.Schema({
    title: {
        pt: { type: String, required: true },
        en: { type: String, required: true }
    },
    description: {
        pt: { type: String },
        en: { type: String }
    },
    date: {
        type: Date,
        required: true
    },
    location: {
        pt: { type: String, default: 'Online / MUV Maputo' },
        en: { type: String, default: 'Online / MUV Maputo' }
    },
    image: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

const Workshop = mongoose.model('Workshop', workshopSchema);

export default Workshop;
