import Service from '../models/Service.js';
import Banner from '../models/Banner.js';
import Setting from '../models/Setting.js';
import Project from '../models/Project.js';
import Product from '../models/Product.js';

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

// Global Settings (Public & Admin)
export const getSetting = async (req, res) => {
    try {
        const setting = await Setting.findOne({ key: req.params.key });
        if (!setting) return res.json({ success: true, data: { setting: null } });
        res.json({ success: true, data: { setting: setting.value } });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Erro ao buscar configuração' });
    }
};

export const updateSetting = async (req, res) => {
    try {
        const { value } = req.body;
        const setting = await Setting.findOneAndUpdate(
            { key: req.params.key },
            { value },
            { new: true, upsert: true }
        );
        res.json({ success: true, data: { setting: setting.value } });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Portfolio Projects
export const getAllProjects = async (req, res) => {
    try {
        const projects = await Project.find().sort({ order: 1, createdAt: -1 });
        res.json({ success: true, data: { projects } });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Erro ao buscar projetos' });
    }
};

export const createProject = async (req, res) => {
    try {
        const project = new Project(req.body);
        await project.save();
        res.status(201).json({ success: true, data: { project } });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const updateProject = async (req, res) => {
    try {
        const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json({ success: true, data: { project } });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const deleteProject = async (req, res) => {
    try {
        await Project.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Projeto eliminado' });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Shop Products
export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find().sort({ order: 1, createdAt: -1 });
        res.json({ success: true, data: { products } });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Erro ao buscar produtos' });
    }
};

export const createProduct = async (req, res) => {
    try {
        const product = new Product(req.body);
        await product.save();
        res.status(201).json({ success: true, data: { product } });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json({ success: true, data: { product } });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Produto eliminado' });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
