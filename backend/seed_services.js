import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Service from './src/models/Service.js';

dotenv.config({ path: './backend/.env' });

const services = [
  {
    title: { pt: 'Consultoria em Engenharia', en: 'Engineering Consulting' },
    description: { 
      pt: 'Apoiamos organizações no planeamento, execução e otimização de grandes infraestruturas. Nossa equipe oferece fiscalização, gestão de obras e soluções avançadas para garantir que cada projeto atenda aos padrões globais de excelência e segurança.', 
      en: 'We support organizations in planning, executing, and optimizing large infrastructures. Our team offers inspection, construction management, and advanced solutions.' 
    },
    icon: 'pi pi-building',
    category: 'engenharia',
    slug: 'consultoria-engenharia',
    image: 'https://images.unsplash.com/photo-1541888085916-3e00b39679de?auto=format&fit=crop&q=80&w=1600',
    featured: true,
    order: 1
  },
  {
    title: { pt: 'Energias Renováveis', en: 'Renewable Energies' },
    description: { 
      pt: 'Impulsionamos a transição energética projetando e implementando sistemas sustentáveis, desde parques solares a soluções integradas de micro-redes. Garantimos eficiência, redução de custos e menor impacto ambiental para empresas de todos os setores.', 
      en: 'We drive the energy transition by designing and implementing sustainable systems, from solar parks to integrated microgrid solutions.' 
    },
    icon: 'pi pi-sun',
    category: 'energia',
    slug: 'energias-renovaveis',
    image: 'https://images.unsplash.com/photo-1509391366360-1e948fc8ecba?auto=format&fit=crop&q=80&w=1600',
    featured: true,
    order: 2
  },
  {
    title: { pt: 'Desenvolvimento de Sistemas', en: 'Systems Integration & Development' },
    description: { 
      pt: 'Transformamos os seus processos de negócio através de engenharia de software de ponta. Criamos web apps personalizadas, dashboards dinâmicos (ERP) e infraestruturas em nuvem para que possa gerir a sua empresa com agilidade total.', 
      en: 'We transform your business processes through cutting-edge software engineering. We build customized web apps, dynamic dashboards (ERP), and cloud infrastructures.' 
    },
    icon: 'pi pi-desktop',
    category: 'tecnologia',
    slug: 'desenvolvimento-sistemas',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1600',
    featured: true,
    order: 3
  }
];

const seedServices = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB for Service Seeding');

        console.log('🧹 Limpando serviços antigos...');
        await Service.deleteMany({});

        console.log('🌱 Injetando os 3 serviços principais (Consultoria, Energias, Sistemas)...');
        await Service.insertMany(services);

        console.log('🚀 Serviços injetados com sucesso! Imagens HD incluídas.');
    } catch (error) {
        console.error('❌ Error in seeding services:', error);
    } finally {
        mongoose.disconnect();
        process.exit();
    }
};

seedServices();
