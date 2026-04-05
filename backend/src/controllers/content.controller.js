import Service from '../models/Service.js';
import Banner from '../models/Banner.js';

// Get all active banners for home
export const getHomeBanners = async (req, res) => {
    try {
        const banners = await Banner.find({ active: true, type: 'home' }).sort({ order: 1 });
        res.json({ success: true, data: { banners } });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Erro ao buscar banners' });
    }
};

// Admin: CRUD Banners
export const createBanner = async (req, res) => {
    try {
        const banner = new Banner(req.body);
        await banner.save();
        res.status(201).json({ success: true, data: { banner } });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const updateBanner = async (req, res) => {
    try {
        const banner = await Banner.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json({ success: true, data: { banner } });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const deleteBanner = async (req, res) => {
    try {
        await Banner.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Banner eliminado' });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Admin: CRUD Services
export const getAllServices = async (req, res) => {
    try {
        const services = await Service.find().sort({ order: 1 });
        res.json({ success: true, data: { services } });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Erro ao buscar serviços' });
    }
};

export const createService = async (req, res) => {
    try {
        const service = new Service(req.body);
        await service.save();
        res.status(201).json({ success: true, data: { service } });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const updateService = async (req, res) => {
    try {
        const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json({ success: true, data: { service } });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const deleteService = async (req, res) => {
    try {
        await Service.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Serviço eliminado' });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
