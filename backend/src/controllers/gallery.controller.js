import GalleryPhoto from '../models/GalleryPhoto.js';

// Public: Get all published gallery photos
export const getGalleryPhotos = async (req, res) => {
    try {
        const photos = await GalleryPhoto.find({ isPublished: true }).sort({ order: 1, createdAt: -1 });
        res.json({ success: true, data: { photos } });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Erro ao buscar fotos da galeria' });
    }
};

// Admin: Get all gallery photos (published and unpublished)
export const getAllGalleryPhotos = async (req, res) => {
    try {
        const photos = await GalleryPhoto.find().sort({ order: 1, createdAt: -1 });
        res.json({ success: true, data: { photos } });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Erro ao buscar fotos da galeria' });
    }
};

// Admin: Create a new gallery photo
export const createGalleryPhoto = async (req, res) => {
    try {
        const photo = new GalleryPhoto(req.body);
        await photo.save();
        res.status(201).json({ success: true, data: { photo } });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Admin: Update a gallery photo
export const updateGalleryPhoto = async (req, res) => {
    try {
        const photo = await GalleryPhoto.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!photo) return res.status(404).json({ success: false, message: 'Foto não encontrada' });
        res.json({ success: true, data: { photo } });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Admin: Delete a gallery photo
export const deleteGalleryPhoto = async (req, res) => {
    try {
        const photo = await GalleryPhoto.findByIdAndDelete(req.params.id);
        if (!photo) return res.status(404).json({ success: false, message: 'Foto não encontrada' });
        res.json({ success: true, message: 'Foto eliminada com sucesso' });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
