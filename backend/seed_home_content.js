import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Banner from './src/models/Banner.js';
import Service from './src/models/Service.js';

dotenv.config({ path: 'backend/.env' });

const banners = [
    {
        title: { pt: 'Liderança em Engenharia 2026', en: 'Engineering Leadership 2026' },
        subtitle: { pt: 'Capacite-se com os maiores especialistas de Moçambique e transforme o futuro.', en: 'Empower yourself with Mozambique\'s top experts and transform the future.' },
        image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=1600',
        ctaText: { pt: 'Explorar Agora', en: 'Explore Now' },
        ctaLink: '/courses',
        active: true,
        type: 'home',
        order: 1
    },
    {
        title: { pt: 'Inovação e Consultoria', en: 'Innovation & Consultancy' },
        subtitle: { pt: 'A nossa inteligência técnica ao serviço do seu projeto estratégico.', en: 'Our technical intelligence at the service of your strategic project.' },
        image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1600',
        ctaText: { pt: 'Solicitar Consultoria', en: 'Request Consultancy' },
        ctaLink: '/#services',
        active: true,
        type: 'home',
        order: 2
    }
];

const services = [
    {
        title: { pt: 'Engenharia de Infraestruturas', en: 'Infrastructure Engineering' },
        description: { pt: 'Projetos e fiscalização de obras de alta complexidade.', en: 'High complexity works project and supervision.' },
        icon: 'pi pi-cog',
        category: 'engenharia',
        slug: 'engenharia-infraestruturas',
        featured: true,
        order: 1
    },
    {
        title: { pt: 'Energias Renováveis', en: 'Renewable Energies' },
        description: { pt: 'Sistemas solares fotovoltaicos e eficiência energética.', en: 'Solar photovoltaic systems and energy efficiency.' },
        icon: 'pi pi-sun',
        category: 'energia',
        slug: 'energias-renovaveis',
        featured: true,
        order: 2
    },
    {
        title: { pt: 'Transformação Digital', en: 'Digital Transformation' },
        description: { pt: 'Sistemas de gestão e ecossistemas tecnológicos modernos.', en: 'Management systems and modern technological ecosystems.' },
        icon: 'pi pi-desktop',
        category: 'tecnologia',
        slug: 'transformacao-digital',
        featured: true,
        order: 3
    }
];

async function seedHomeContent() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        await Banner.deleteMany({ type: 'home' });
        await Service.deleteMany({});
        
        await Banner.insertMany(banners);
        await Service.insertMany(services);

        console.log('Home content seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Seed error:', error.message);
        process.exit(1);
    }
}

seedHomeContent();
