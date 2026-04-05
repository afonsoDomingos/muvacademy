import User from '../models/User.js';
import Task from '../models/Task.js';
import FinancialRecord from '../models/FinancialRecord.js';
import Customer from '../models/Customer.js';
import Proposal from '../models/Proposal.js';

// --- EMPLOYEES ---
export const getEmployees = async (req, res) => {
    try {
        const employees = await User.find({ role: { $in: ['colaborador', 'gestor', 'admin'] } }).sort('name');
        res.json({ success: true, data: { employees } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const promoteEmployee = async (req, res) => {
    try {
        const { role, department } = req.body;
        const employee = await User.findByIdAndUpdate(req.params.id, { role, department, hiredAt: new Date() }, { new: true });
        res.json({ success: true, data: { employee } });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// --- TASKS ---
export const getTasks = async (req, res) => {
    try {
        const { department, status, assignedTo } = req.query;
        let query = {};
        if (department) query.department = department;
        if (status) query.status = status;
        if (assignedTo) query.assignedTo = assignedTo;

        const tasks = await Task.find(query).populate('assignedTo', 'name email avatar').sort('-deadline');
        res.json({ success: true, data: { tasks } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const createTask = async (req, res) => {
    try {
        const task = new Task({ ...req.body, createdBy: req.user._id });
        await task.save();
        res.status(201).json({ success: true, data: { task } });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const updateTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json({ success: true, data: { task } });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// --- STATS OVERVIEW ---
export const getAdminOverview = async (req, res) => {
    try {
        const [empCount, custCount, taskCount, proposalCount, finance] = await Promise.all([
            User.countDocuments({ role: { $ne: 'cliente' } }),
            Customer.countDocuments(),
            Task.countDocuments({ status: { $ne: 'concluida' } }),
            Proposal.countDocuments({ status: 'submetido' }),
            FinancialRecord.aggregate([
                { $group: { _id: "$type", total: { $sum: "$amount" } } }
            ])
        ]);

        res.json({
            success: true,
            data: {
                employees: empCount,
                customers: custCount,
                activeTasks: taskCount,
                submittedProposals: proposalCount,
                finances: finance
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
