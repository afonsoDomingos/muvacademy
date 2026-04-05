import Workshop from '../models/Workshop.js';

export const getWorkshops = async (req, res) => {
    try {
        const workshops = await Workshop.find({ isActive: true }).sort('date');
        res.json({ success: true, data: { workshops } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const createWorkshop = async (req, res) => {
    try {
        const workshop = new Workshop(req.body);
        await workshop.save();
        res.status(201).json({ success: true, data: { workshop } });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const updateWorkshop = async (req, res) => {
    try {
        const workshop = await Workshop.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json({ success: true, data: { workshop } });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const deleteWorkshop = async (req, res) => {
    try {
        await Workshop.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Workshop removido!' });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
