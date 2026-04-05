import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Banner from './src/models/Banner.js';
import Service from './src/models/Service.js';

dotenv.config();

const seedContent = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('📦 Connected to MongoDB');

        // Seed Banners
        await Banner.deleteMany({});
        await Banner.create([
            {
                title: { pt: 'MUV Academy 2026', en: 'MUV Academy 2026' },
                subtitle: { pt: 'Capacitação técnica de elite em Engenharia, SAP e Gestão.', en: 'Elite technical training in Engineering, SAP, and Management.' },
                ctaText: { pt: 'Explorar Cursos', en: 'Explore Courses' },
                ctaLink: '/courses',
                image: '/images/hero-premium.png',
                order: 1,
                type: 'home'
            },
            {
                title: { pt: 'Consultoria Especializada', en: 'Specialized Consultancy' },
                subtitle: { pt: 'Soluções inteligentes para infraestruturas complexas em Moçambique.', en: 'Smart solutions for complex infrastructures in Mozambique.' },
                ctaText: { pt: 'Saiba Mais', en: 'Learn More' },
                ctaLink: '#services',
                image: '/images/courses/pvsyst.jpg',
                order: 2,
                type: 'home'
            }
        ]);
        console.log('✅ Banners seeded');

        // Seed Services
        await Service.deleteMany({});
        await Service.create([
            {
                title: { pt: 'Consultoria em Engenharia', en: 'Engineering Consultancy' },
                description: { pt: 'Apoio técnico em projetos civis, elétricos e de infraestrutura.', en: 'Technical support in civil, electrical, and infrastructure projects.' },
                icon: 'pi pi-briefcase',
                category: 'engenharia',
                featured: true,
                slug: 'consultoria-engenharia'
            },
            {
                title: { pt: 'Sistemas de Energia Solar', en: 'Solar Energy Systems' },
                description: { pt: 'Fornecimento e instalação de soluções de energia sustentável.', en: 'Supply and installation of sustainable energy solutions.' },
                icon: 'pi pi-sun',
                category: 'energia',
                featured: true,
                slug: 'energia-solar'
            },
            {
                title: { pt: 'Implementação SAP', en: 'SAP Implementation' },
                description: { pt: 'Otimização de processos empresariais com tecnologia de ponta.', en: 'Business process optimization with cutting-edge technology.' },
                icon: 'pi pi-box',
                category: 'tecnologia',
                featured: true,
                slug: 'sap-implementation'
            }
        ]);
        console.log('✅ Services seeded');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding content:', error);
        process.exit(1);
    }
};

seedContent();
