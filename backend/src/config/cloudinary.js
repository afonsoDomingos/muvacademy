import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';

dotenv.config();

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Storage for course images
const courseImageStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'muv-academy/courses',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        transformation: [{ width: 800, height: 450, crop: 'fill' }]
    }
});

// Storage for user avatars
const avatarStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'muv-academy/avatars',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        transformation: [{ width: 200, height: 200, crop: 'fill', gravity: 'face' }]
    }
});

// Storage for payment proofs
const proofStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'muv-academy/payment-proofs',
        allowed_formats: ['jpg', 'jpeg', 'png', 'pdf', 'webp'],
        resource_type: 'auto'
    }
});

// Storage for lesson materials (videos, PDFs, images)
const materialStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        let resourceType = 'auto';
        let folder = 'muv-academy/materials';

        if (file.mimetype.startsWith('video/')) {
            resourceType = 'video';
            folder = 'muv-academy/materials/videos';
        } else if (file.mimetype === 'application/pdf') {
            resourceType = 'raw';
            folder = 'muv-academy/materials/pdfs';
        } else if (file.mimetype.startsWith('image/')) {
            resourceType = 'image';
            folder = 'muv-academy/materials/images';
        }

        return {
            folder,
            resource_type: resourceType,
            allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'pdf', 'mp4', 'mov', 'avi', 'mkv']
        };
    }
});

// Multer upload instances
export const uploadCourseImage = multer({
    storage: courseImageStorage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

export const uploadAvatar = multer({
    storage: avatarStorage,
    limits: { fileSize: 2 * 1024 * 1024 } // 2MB
});

export const uploadProof = multer({
    storage: proofStorage,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

export const uploadMaterial = multer({
    storage: materialStorage,
    limits: { fileSize: 500 * 1024 * 1024 } // 500MB for videos
});

// Direct Cloudinary upload function
export const uploadToCloudinary = async (filePath, options = {}) => {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            folder: options.folder || 'muv-academy/general',
            resource_type: options.resourceType || 'auto',
            ...options
        });
        return result;
    } catch (error) {
        console.error('Cloudinary upload error:', error);
        throw error;
    }
};

// Delete file from Cloudinary
export const deleteFromCloudinary = async (publicId, resourceType = 'image') => {
    try {
        const result = await cloudinary.uploader.destroy(publicId, {
            resource_type: resourceType
        });
        return result;
    } catch (error) {
        console.error('Cloudinary delete error:', error);
        throw error;
    }
};

export default cloudinary;
