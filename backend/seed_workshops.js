import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Workshop from './src/models/Workshop.js';

dotenv.config({ path: 'backend/.env' });

const workshops = [
    {
        title: { pt: 'Workshop: Dimensionamento Fotovoltaico', en: 'Workshop: Photovoltaic Sizing' },
        description: { pt: 'Aprenda a projetar sistemas solares do zero com especialistas.', en: 'Learn to design solar systems from scratch with experts.' },
        date: new Date('2026-04-12T14:30:00Z'),
        location: { pt: 'Online / Zoom', en: 'Online / Zoom' },
        image: '/images/courses/pvsyst.jpg',
        link: 'https://zoom.us/j/muv-academy-solar',
        isActive: true
    },
    {
        title: { pt: 'Masterclass: Agile em Engenharia', en: 'Masterclass: Agile in Engineering' },
        description: { pt: 'Gestão de projetos complexos utilizando metodologias ágeis.', en: 'Complex project management using agile methodologies.' },
        date: new Date('2026-04-19T10:00:00Z'),
        location: { pt: 'MUV Hub - Maputo', en: 'MUV Hub - Maputo' },
        image: '/images/courses/ai-business.jpg',
        link: 'https://muv.co.mz/workshops/agile',
        isActive: true
    }
];

const seedWorkshops = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        await Workshop.deleteMany();
        await Workshop.insertMany(workshops);
        console.log('Workshops seeded successfully!');
        process.exit();
    } catch (error) {
        console.error('Error seeding workshops:', error);
        process.exit(1);
    }
};

seedWorkshops();
