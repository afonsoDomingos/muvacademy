import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
    title: {
        pt: { type: String, required: true },
        en: { type: String, required: true }
    },
    description: {
        pt: { type: String, required: true },
        en: { type: String, required: true }
    },
    icon: {
        type: String,
        default: 'pi pi-briefcase'
    },
    category: {
        type: String,
        enum: ['consultoria', 'energia', 'engenharia', 'tecnologia', 'outros'],
        required: true
    },
    image: String,
    featured: {
        type: Boolean,
        default: false
    },
    order: {
        type: Number,
        default: 0
    },
    slug: {
        type: String,
        required: true,
        unique: true
    }
}, {
    timestamps: true
});

const Service = mongoose.model('Service', serviceSchema);

export default Service;
