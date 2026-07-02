import mongoose from 'mongoose';

const galleryPhotoSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  image: {
    type: String,
    required: [true, 'A imagem é obrigatória']
  },
  imagePublicId: {
    type: String,
    default: ''
  },
  location: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    default: 'campo',
    enum: ['campo', 'instalacao', 'equipa', 'formacao', 'evento', 'outro']
  },
  isPublished: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

const GalleryPhoto = mongoose.model('GalleryPhoto', galleryPhotoSchema);

export default GalleryPhoto;
