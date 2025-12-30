import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User.js';
import Course from './src/models/Course.js';

dotenv.config();

const addCourses = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('📦 Connected to MongoDB');

        const admin = await User.findOne({ email: 'admin@muvacademy.co.mz' });
        if (!admin) {
            console.error('❌ Admin user not found. Run fix_users.js first.');
            process.exit(1);
        }

        const newCourses = [
            {
                title: { pt: 'IA para Negócios', en: 'AI for Business' },
                description: {
                    pt: 'Aprenda a aplicar Inteligência Artificial para otimizar processos e apoiar decisões estratégicas.',
                    en: 'Learn how to apply Artificial Intelligence to optimize processes and support strategic decisions.'
                },
                priceMZN: 3500,
                priceUSD: 55,
                categories: ['gestao'],
                duration: { hours: 40, minutes: 0 },
                level: 'todos',
                published: true,
                featured: true,
                instructor: admin._id,
                image: '/images/courses/ai-business.jpg'
            },
            {
                title: { pt: 'GIS (Sistemas de Informação Geográfica) – Avançado', en: 'GIS (Geographic Information Systems) – Advanced' },
                description: {
                    pt: 'Domine ferramentas de mapeamento e análise espacial para projetos de engenharia e ambientais.',
                    en: 'Master mapping and spatial analysis tools for engineering and environmental projects.'
                },
                priceMZN: 5000,
                priceUSD: 75,
                categories: ['geoprocessamento', 'engenharia-civil'],
                duration: { hours: 60, minutes: 0 },
                level: 'avancado',
                published: true,
                featured: true,
                instructor: admin._id,
                image: '/images/courses/gis.jpg'
            },
            {
                title: { pt: 'PVSyst – Energia Solar', en: 'PVSyst – Solar Energy' },
                description: {
                    pt: 'Curso completo sobre dimensionamento e simulação de sistemas fotovoltaicos utilizando o PVSyst.',
                    en: 'Complete course on sizing and simulation of photovoltaic systems using PVSyst.'
                },
                priceMZN: 4500,
                priceUSD: 70,
                categories: ['energia-sustentabilidade', 'energia-renovavel'],
                duration: { hours: 30, minutes: 0 },
                level: 'intermediario',
                published: true,
                featured: true,
                instructor: admin._id,
                image: '/images/courses/pvsyst.jpg'
            },
            {
                title: { pt: 'SAP – Gestão Empresarial', en: 'SAP – Business Management' },
                description: {
                    pt: 'Capacitação nos principais módulos do sistema SAP para uma gestão eficiente de recursos empresariais.',
                    en: 'Training in the main modules of the SAP system for efficient management of business resources.'
                },
                priceMZN: 8500,
                priceUSD: 130,
                categories: ['gestao', 'software'],
                duration: { hours: 80, minutes: 0 },
                level: 'todos',
                published: true,
                featured: true,
                instructor: admin._id,
                image: '/images/courses/sap.jpg'
            },
            {
                title: { pt: 'AutoCAD do Básico ao Avançado', en: 'AutoCAD from Basic to Advanced' },
                description: {
                    pt: 'Domine o software CAD mais utilizado no mundo para projetos de engenharia e arquitetura.',
                    en: 'Master the most used CAD software in the world for engineering and architectural projects.'
                },
                priceMZN: 4500,
                priceUSD: 75,
                categories: ['engenharia-civil', 'arquitetura'],
                duration: { hours: 50, minutes: 0 },
                level: 'todos',
                published: true,
                featured: true,
                instructor: admin._id,
                image: '/images/courses/autocad.jpg'
            }
        ];

        // Cleanup AutoCAD duplicates to ensure clean state
        await Course.deleteMany({ 'title.pt': 'AutoCAD do Básico ao Avançado' });
        console.log('🗑️ Removed old/duplicate AutoCAD entries');

        for (const courseData of newCourses) {
            await Course.findOneAndUpdate(
                { 'title.pt': courseData.title.pt },
                courseData,
                { upsert: true, new: true }
            );
            console.log(`✅ Curso atualizado/criado: ${courseData.title.pt}`);
        }

        console.log('\n🚀 Novos cursos adicionados com sucesso ao catálogo!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Erro ao adicionar cursos:', error);
        process.exit(1);
    }
};

addCourses();
