import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Service from './src/models/Service.js';

dotenv.config({ path: 'backend/.env' });

const services = [
    {
        title: { pt: 'Engenharia e Projetos', en: 'Engineering & Projects' },
        description: { 
            pt: 'Dimensionamento de sistemas solares, auditoria energética e fiscalização de obras tecnológicas.', 
            en: 'Solar system sizing, energy auditing and technological works supervision.' 
        },
        icon: 'pi pi-cog',
        active: true
    },
    {
        title: { pt: 'Educação Técnica', en: 'Technical Education' },
        description: { 
            pt: 'Formação especializada em energias renováveis e tecnologias de ponta para profissionais.', 
            en: 'Specialized training in renewable energy and cutting-edge technologies for professionals.' 
        },
        icon: 'pi pi-book',
        active: true
    },
    {
        title: { pt: 'Transformação Digital', en: 'Digital Transformation' },
        description: { 
            pt: 'Desenvolvimento de ecossistemas digitais e automação para empresas modernas.', 
            en: 'Development of digital ecosystems and automation for modern companies.' 
        },
        icon: 'pi pi-desktop',
        active: true
    }
];

async function seedServices() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        await Service.deleteMany({});
        console.log('Cleared existing services');

        await Service.insertMany(services);
        console.log('Services seeded successfully');

        process.exit(0);
    } catch (error) {
        console.error('Seed error:', error);
        process.exit(1);
    }
}

seedServices();
