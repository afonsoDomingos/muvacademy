import mongoose from 'mongoose';
import Project from './src/models/Project.js';
import dotenv from 'dotenv';

dotenv.config();

const projects = [
  {
    title: 'OtakuZoneFlix',
    category: 'web',
    description: 'Plataforma de streaming on-demand com arquitetura robusta para entrega eficiente de vídeos e gestão de assinaturas.',
    image: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    tags: ['React', 'Node.js', 'MongoDB', 'Cloudinary'],
    link: '#',
    order: 1
  },
  {
    title: 'Motiva Contests',
    category: 'system',
    description: 'Sistema completo de gestão de concursos criativos com pipelines de fases automatizadas e submissões.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    tags: ['Vue 3', 'Express', 'PostgreSQL'],
    link: '#',
    order: 2
  },
  {
    title: 'SmartGym App',
    category: 'mobile',
    description: 'Aplicativo móvel focado no acompanhamento de treinos, evolução física e interação via comunidade.',
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    tags: ['React Native', 'Firebase'],
    link: '#',
    order: 3
  },
  {
    title: 'MUV Nexus ERP',
    category: 'system',
    description: 'Painel e gestor completo de finanças, projetos e tarefas, com insights inteligentes usando IA.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    tags: ['Vue 3', 'TailwindCSS', 'Node.js'],
    link: '#',
    order: 4
  },
  {
    title: 'BrandIdentity - Lumi',
    category: 'design',
    description: 'Reformulação de marca completa, design system e documentação UI/UX moderna e fluida.',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    tags: ['Figma', 'Illustrator'],
    link: '#',
    order: 5
  },
  {
    title: 'Aura E-Commerce',
    category: 'web',
    description: 'Solução moderna de e-commerce de alta conversão, totalmente responsiva e agradável.',
    image: 'https://images.unsplash.com/photo-1661956602116-aa6865609028?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    tags: ['Next.js', 'Stripe', 'TailwindCSS'],
    link: '#',
    order: 6
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
