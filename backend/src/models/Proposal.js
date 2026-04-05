import mongoose from 'mongoose';

const proposalSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    client: {
        type: String,
        required: true
    },
    deadline: {
        type: Date,
        required: true
    },
    amount: {
        type: Number
    },
    status: {
        type: String,
        enum: ['preparacao', 'submetido', 'aprovado', 'rejeitado', 'em_analise'],
        default: 'preparacao'
    },
    department: {
        type: String,
        required: true,
        enum: ['Engenharia', 'Educação', 'Tecnologia']
    },
    documents: [{
        name: String,
        url: String
    }],
    team: [{
         type: mongoose.Schema.Types.ObjectId,
         ref: 'User'
    }],
    notes: {
        type: String
    }
}, {
    timestamps: true
});

const Proposal = mongoose.model('Proposal', proposalSchema);

export default Proposal;
