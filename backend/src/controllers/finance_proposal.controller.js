import FinancialRecord from '../models/FinancialRecord.js';
import Proposal from '../models/Proposal.js';

// --- FINANCE ---
export const getFinances = async (req, res) => {
    try {
        const finances = await FinancialRecord.find().sort('-date');
        const stats = await FinancialRecord.aggregate([
            { $group: { _id: "$type", total: { $sum: "$amount" } } }
        ]);
        res.json({ success: true, data: { finances, stats } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const createFinanceRecord = async (req, res) => {
    try {
        const record = new FinancialRecord({ ...req.body, recordedBy: req.user._id });
        await record.save();
        res.status(201).json({ success: true, data: { record } });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// --- PROPOSALS / TENDERS ---
export const getProposals = async (req, res) => {
    try {
        const proposals = await Proposal.find().sort('-deadline');
        res.json({ success: true, data: { proposals } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const createProposal = async (req, res) => {
    try {
        const proposal = new Proposal(req.body);
        await proposal.save();
        res.status(201).json({ success: true, data: { proposal } });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const updateProposalStatus = async (req, res) => {
    try {
        const proposal = await Proposal.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
        res.json({ success: true, data: { proposal } });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
