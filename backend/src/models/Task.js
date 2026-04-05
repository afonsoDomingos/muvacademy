import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    department: {
        type: String,
        required: true
    },
    priority: {
        type: String,
        enum: ['baixa', 'media', 'alta', 'urgente'],
        default: 'media'
    },
    status: {
        type: String,
        enum: ['pendente', 'em_progresso', 'concluida', 'atrasada'],
        default: 'pendente'
    },
    deadline: {
        type: Date,
        required: true
    },
    completedAt: {
        type: Date
    },
    comments: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        text: String,
        createdAt: { type: Date, default: Date.now }
    }]
}, {
    timestamps: true
});

const Task = mongoose.model('Task', taskSchema);

export default Task;
