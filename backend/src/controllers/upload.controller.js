import cloudinary, { uploadCourseImage, uploadAvatar, uploadProof, uploadMaterial } from '../config/cloudinary.js';

// Upload course image
export const uploadCourseImageHandler = (req, res) => {
    uploadCourseImage.single('image')(req, res, (err) => {
        if (err) return res.status(400).json({ success: false, message: err.message });
        if (!req.file) return res.status(400).json({ success: false, message: 'Nenhum arquivo enviado.' });
        res.json({ success: true, data: { url: req.file.path, publicId: req.file.filename } });
    });
};

// Upload avatar
export const uploadAvatarHandler = (req, res) => {
    uploadAvatar.single('avatar')(req, res, (err) => {
        if (err) return res.status(400).json({ success: false, message: err.message });
        if (!req.file) return res.status(400).json({ success: false, message: 'Nenhum arquivo enviado.' });
        res.json({ success: true, data: { url: req.file.path, publicId: req.file.filename } });
    });
};

// Upload payment proof
export const uploadProofHandler = (req, res) => {
    uploadProof.single('proof')(req, res, (err) => {
        if (err) return res.status(400).json({ success: false, message: err.message });
        if (!req.file) return res.status(400).json({ success: false, message: 'Nenhum arquivo enviado.' });
        res.json({ success: true, data: { url: req.file.path, publicId: req.file.filename } });
    });
};

// Upload lesson material
export const uploadMaterialHandler = (req, res) => {
    uploadMaterial.single('material')(req, res, (err) => {
        if (err) return res.status(400).json({ success: false, message: err.message });
        if (!req.file) return res.status(400).json({ success: false, message: 'Nenhum arquivo enviado.' });

        // Determine file type
        let fileType = 'other';
        if (req.file.mimetype.startsWith('video/')) fileType = 'video';
        else if (req.file.mimetype === 'application/pdf') fileType = 'pdf';
        else if (req.file.mimetype.startsWith('image/')) fileType = 'image';

        res.json({ success: true, data: { url: req.file.path, publicId: req.file.filename, fileType, mimeType: req.file.mimetype, fileSize: req.file.size } });
    });
};

// Delete from cloudinary
export const deleteFile = async (req, res) => {
    try {
        const { publicId, resourceType = 'image' } = req.body;
        await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
        res.json({ success: true, message: 'Arquivo deletado.' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Erro ao deletar arquivo.' });
    }
};
