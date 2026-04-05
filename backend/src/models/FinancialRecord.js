import mongoose from 'mongoose';

const financialRecordSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['receita', 'despesa'],
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: [
            'cursos', 
            'servicos', 
            'operacional', 
            'marketing', 
            'salarios', 
            'infraestrutura', 
            'procurement', 
            'outros'
        ]
    },
    amount: {
        type: Number,
        required: true
    },
    department: {
        type: String,
        required: true,
        default: 'Geral'
    },
    description: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    recordedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['pendente', 'pago', 'cancelado'],
        default: 'pago'
    }
}, {
    timestamps: true
});

const FinancialRecord = mongoose.model('FinancialRecord', financialRecordSchema);

export default FinancialRecord;
