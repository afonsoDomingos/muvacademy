import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// Load .env from backend root
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: resolve(__dirname, '../../.env') });

import User from '../models/User.js';
import Course from '../models/Course.js';

const addCourses = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('📦 Connected to MongoDB');

        const admin = await User.findOne({ email: 'admin@muvacademy.co.mz' });
        if (!admin) {
            console.error('❌ Admin user not found. Run the main seed first.');
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
                priceMZN: 10000,
                priceUSD: 160,
                pricingOptions: [
                    {
                        title: { pt: 'Módulos Funcionais', en: 'Functional Modules' },
                        priceMZN: 10000,
                        priceUSD: 160,
                        description: { pt: 'Gestão Financeira (FI), Controladoria (CO), Vendas (SD), Materiais (MM), etc.', en: 'Financial (FI), Controlling (CO), Sales (SD), Materials (MM), etc.' }
                    },
                    {
                        title: { pt: 'Módulos Técnicos ou Infraestrutura', en: 'Technical or Infrastructure Modules' },
                        priceMZN: 25000,
                        priceUSD: 400,
                        description: { pt: 'ABAP, Basis, NetWeaver, Integração (PI/PO), etc.', en: 'ABAP, Basis, NetWeaver, Integration (PI/PO), etc.' }
                    },
                    {
                        title: { pt: 'Módulos Setoriais ou Industry', en: 'Sectorial or Industry Modules' },
                        priceMZN: 35000,
                        priceUSD: 550,
                        description: { pt: 'Oil & Gas, Banking, Retail, Healthcare, Utilities, etc.', en: 'Oil & Gas, Banking, Retail, Healthcare, Utilities, etc.' }
                    }
                ],
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
            },
            {
                title: { pt: 'Tráfego Pago e Marketing Digital', en: 'Paid Traffic & Digital Marketing' },
                description: {
                    pt: 'Aprenda a criar campanhas de alta conversão no Facebook Ads e Google Ads com baixo investimento.',
                    en: 'Learn to create high-converting campaigns on Facebook Ads and Google Ads with low investment.'
                },
                priceMZN: 499,
                priceUSD: 10,
                categories: ['gestao', 'outros'],
                duration: { hours: 12, minutes: 0 },
                level: 'iniciante',
                published: true,
                featured: true,
                instructor: admin._id,
                image: '/images/courses/marketing.jpg'
            }
        ];

        // Helper to generate slug
        const generateSlug = (text) => {
            return text.toString().toLowerCase()
                .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
                .replace(/\s+/g, '-')
                .replace(/[^\w\-]+/g, '')
                .replace(/\-\-+/g, '-')
                .replace(/^-+/, '')
                .replace(/-+$/, '')
                + '-' + Date.now();
        };

        for (const courseData of newCourses) {
            const existing = await Course.findOne({ 'title.pt': courseData.title.pt });
            if (!existing) {
                courseData.slug = generateSlug(courseData.title.pt);
            } else {
                courseData.slug = existing.slug || generateSlug(courseData.title.pt);
            }

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
