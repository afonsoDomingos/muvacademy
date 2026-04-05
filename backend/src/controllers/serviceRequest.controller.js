import ServiceRequest from '../models/ServiceRequest.js';

export const createServiceRequest = async (req, res) => {
    try {
        const { name, email, phone, company, type, message, service } = req.body;
        const newRequest = new ServiceRequest({
            user: req.user?._id, // User is optional
            name, email, phone, company, type, message, service
        });
        await newRequest.save();
        res.status(201).json({ success: true, message: 'Pedido enviado com sucesso!' });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const getRequests = async (req, res) => {
    try {
        const requests = await ServiceRequest.find().sort('-createdAt');
        res.json({ success: true, data: { requests } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getMyRequests = async (req, res) => {
    try {
        const requests = await ServiceRequest.find({ user: req.user._id }).sort('-createdAt');
        res.json({ success: true, data: { requests } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateRequestStatus = async (req, res) => {
    try {
        const request = await ServiceRequest.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
        res.json({ success: true, data: { request } });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
