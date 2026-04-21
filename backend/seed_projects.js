import mongoose from 'mongoose';
import Project from './src/models/Project.js';
import dotenv from 'dotenv';

dotenv.config();

const projects = [
  {
    title: 'OCRMUV',
    category: 'web',
    description: 'Plataforma inteligente de Digitalização de Documentos (OCR) que transforma imagens em texto estruturado com alta precisão.',
    image: 'https://images.unsplash.com/photo-1568667256549-094345857637?auto=format&fit=crop&w=800&q=80',
    tags: ['OCR', 'AI', 'Digitalização', 'Vercel'],
    link: 'https://ocrmuv.vercel.app/',
    order: 1
  },
  {
    title: 'PredictAI',
    category: 'system',
    description: 'Sistema avançado de planeamento de manutenção industrial, focado em gestão de recursos e redução de downtime.',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80',
    tags: ['Manutenção', 'ERP', 'Predictive', 'Node.js'],
    link: 'https://planeador-de-manuntencao.vercel.app/',
    order: 2
  },
  {
    title: 'EcoGuard',
    category: 'system',
    description: 'Sistema completo de controlo e monitoramento de actividades ambientais para conformidade e sustentabilidade.',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
    tags: ['Ambiente', 'Monitorização', 'Gestão', 'Sustentabilidade'],
    link: 'https://ecoguardmuv.vercel.app/',
    order: 3
  },
  {
    title: 'AquaFlow',
    category: 'system',
    description: 'Sistema IoT de monitoramento de humidade do solo em tempo real, permitindo uma gestão hídrica inteligente e eficiente.',
    image: 'https://images.unsplash.com/photo-1558449028-b53a39d100fc?auto=format&fit=crop&w=800&q=80',
    tags: ['IoT', 'Agricultura', 'Sensores', 'AquaTech'],
    link: 'https://sistema-de-monitoramento-de-umidade.vercel.app/',
    order: 4
  }
];

async function seedProjects() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    await Project.deleteMany({});
    console.log('Deleted existing projects');

    await Project.insertMany(projects);
    console.log('Inserted seed projects');

    mongoose.connection.close();
    console.log('Connection closed');
  } catch (error) {
    console.error('Error seeding projects:', error);
    process.exit(1);
  }
}

seedProjects();
