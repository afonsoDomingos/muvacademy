import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String
    },
    company: {
        type: String
    },
    category: {
        type: String,
        enum: ['institucional', 'individual', 'parceiro'],
        default: 'individual'
    },
    status: {
        type: String,
        enum: ['lead', 'ativo', 'inativo'],
        default: 'lead'
    },
    interactions: [{
        date: { type: Date, default: Date.now },
        type: { type: String, enum: ['reuniao', 'email', 'proposta', 'fechado'] },
        description: String
    }],
    projects: [{ type: String }], // Optional project IDs or names
    recordedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

const Customer = mongoose.model('Customer', customerSchema);

export default Customer;
