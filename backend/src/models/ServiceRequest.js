import mongoose from 'mongoose';

const serviceRequestSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' // Optional if guest
    },
    service: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String
    },
    company: {
        type: String
    },
    type: {
        type: String,
        enum: ['orcamento', 'marcacao'],
        default: 'orcamento'
    },
    message: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pendente', 'em_analise', 'concluido', 'cancelado'],
        default: 'pendente'
    }
}, {
    timestamps: true
});

const ServiceRequest = mongoose.model('ServiceRequest', serviceRequestSchema);

export default ServiceRequest;
