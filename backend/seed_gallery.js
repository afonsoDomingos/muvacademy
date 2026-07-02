import mongoose from 'mongoose';
import dotenv from 'dotenv';
import GalleryPhoto from './src/models/GalleryPhoto.js';

dotenv.config();

const samplePhotos = [
  {
    title: 'Instalação Solar Residencial de Elite',
    description: 'Sistema fotovoltaico off-grid montado na Matola com baterias de lítio de última geração.',
    image: 'https://images.unsplash.com/photo-1509391366360-fe19a78e729b?auto=format&fit=crop&w=1200&q=80',
    location: 'Matola, Maputo',
    category: 'instalacao',
    isPublished: true,
    order: 1
  },
  {
    title: 'Estudo de Viabilidade no Terreno',
    description: 'Nossa equipa de engenheiros realizando medições de irradiância solar directa para um projeto industrial.',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80',
    location: 'Boane, Maputo',
    category: 'campo',
    isPublished: true,
    order: 2
  },
  {
    title: 'Formação Prática MUV Academy',
    description: 'Estudantes da MUV Academy aprendendo a fazer conexões seguras de inversores híbridos.',
    image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=1200&q=80',
    location: 'Cidade de Maputo',
    category: 'formacao',
    isPublished: true,
    order: 3
  },
  {
    title: 'Apresentação de Soluções Sustentáveis',
    description: 'Workshop corporativo demonstrando as vantagens de micro-redes solares para indústrias de Moçambique.',
    image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80',
    location: 'Vilankulo, Inhambane',
    category: 'evento',
    isPublished: true,
    order: 4
  }
];

const seedGallery = async () => {
  try {
    const connStr = process.env.MONGODB_URI || 'mongodb://localhost:27017/muv_academy';
    console.log(`Conectando à base de dados para semear Galeria...`);
    await mongoose.connect(connStr);
    
    // Clear existing
    await GalleryPhoto.deleteMany({ category: { $in: ['campo', 'instalacao', 'formacao', 'evento'] } });
    console.log('Galeria limpa para inserção de dados de exemplo...');
    
    // Insert new
    await GalleryPhoto.insertMany(samplePhotos);
    console.log('Galeria semeada com sucesso com fotos de exemplo!');
    
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Erro ao semear a galeria:', error);
    process.exit(1);
  }
};

seedGallery();
