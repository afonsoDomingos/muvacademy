import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Course from '../models/Course.js';
import Module from '../models/Module.js';
import Lesson from '../models/Lesson.js';

dotenv.config();

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/muv_academy');
        console.log('📦 Connected to MongoDB');

        // Clear existing data (optional - comment out if you don't want to reset)
        // await Promise.all([User.deleteMany({}), Course.deleteMany({}), Module.deleteMany({}), Lesson.deleteMany({})]);

        // Create Superadmin
        const superadminExists = await User.findOne({ email: process.env.SUPERADMIN_EMAIL || 'superadmin@muvacademy.co.mz' });
        if (!superadminExists) {
            await User.create({
                name: 'Super Admin',
                email: process.env.SUPERADMIN_EMAIL || 'superadmin@muvacademy.co.mz',
                password: process.env.SUPERADMIN_PASSWORD || 'Super@123456',
                role: 'superadmin',
                language: 'pt',
                isActive: true
            });
            console.log('✅ Superadmin created');
        }

        // Create Admin
        const adminExists = await User.findOne({ email: process.env.ADMIN_EMAIL || 'admin@muvacademy.co.mz' });
        let admin;
        if (!adminExists) {
            admin = await User.create({
                name: 'Admin MUV',
                email: process.env.ADMIN_EMAIL || 'admin@muvacademy.co.mz',
                password: process.env.ADMIN_PASSWORD || 'Admin@123456',
                role: 'admin',
                language: 'pt',
                profession: 'Engenheiro Civil',
                bio: 'Administrador da plataforma MUV Academy',
                isActive: true
            });
            console.log('✅ Admin created');
        } else {
            admin = adminExists;
        }

        // Create Client
        const clientEmail = 'cliente@muvacademy.co.mz';
        const clientExists = await User.findOne({ email: clientEmail });
        if (!clientExists) {
            await User.create({
                name: 'Cliente Teste',
                email: clientEmail,
                password: '@Cliente123@',
                role: 'cliente',
                language: 'pt',
                isActive: true
            });
            console.log('✅ Client test user created');
        }

        // Create sample course
        const courseExists = await Course.findOne({ slug: /autocad-basico-avancado/ });
        if (!courseExists) {
            const course = await Course.create({
                title: { pt: 'AutoCAD do Básico ao Avançado', en: 'AutoCAD from Basic to Advanced' },
                description: {
                    pt: 'Domine o AutoCAD do zero! Aprenda a criar projetos 2D e 3D profissionais. Curso completo com certificado.',
                    en: 'Master AutoCAD from scratch! Learn to create professional 2D and 3D projects. Complete course with certificate.'
                },
                shortDescription: {
                    pt: 'Aprenda AutoCAD do zero ao profissional',
                    en: 'Learn AutoCAD from zero to professional'
                },
                instructor: admin._id,
                priceMZN: 2500,
                priceUSD: 39,
                categories: ['autocad', 'engenharia-civil', 'arquitetura'],
                level: 'todos',
                language: 'pt',
                requirements: { pt: ['Computador com Windows', 'AutoCAD instalado (versão teste)'], en: ['Computer with Windows', 'AutoCAD installed (trial version)'] },
                objectives: { pt: ['Dominar ferramentas de desenho 2D', 'Criar projetos em 3D', 'Plotar e imprimir projetos'], en: ['Master 2D drawing tools', 'Create 3D projects', 'Plot and print projects'] },
                targetAudience: { pt: ['Engenheiros', 'Arquitetos', 'Técnicos', 'Estudantes'], en: ['Engineers', 'Architects', 'Technicians', 'Students'] },
                certificate: true,
                published: true,
                featured: true,
                paymentInfo: { bankName: 'Millennium BIM', accountNumber: '123456789', accountName: 'MUV Educação', nuit: '123456789', mpesaNumber: '84 123 4567' }
            });

            // Create modules
            const mod1 = await Module.create({
                courseId: course._id,
                title: { pt: 'Módulo 1 - Introdução ao AutoCAD', en: 'Module 1 - Introduction to AutoCAD' },
                description: { pt: 'Conhecendo a interface e primeiros passos', en: 'Getting to know the interface and first steps' },
                order: 1
            });

            const mod2 = await Module.create({
                courseId: course._id,
                title: { pt: 'Módulo 2 - Desenho 2D', en: 'Module 2 - 2D Drawing' },
                description: { pt: 'Ferramentas de desenho bidimensional', en: '2D drawing tools' },
                order: 2
            });

            // Create lessons
            await Lesson.create({
                moduleId: mod1._id,
                title: { pt: 'Aula 1 - Interface do AutoCAD', en: 'Lesson 1 - AutoCAD Interface' },
                description: { pt: 'Conhecendo a interface e menus principais', en: 'Getting to know the interface and main menus' },
                order: 1,
                isFree: true,
                materials: []
            });

            await Lesson.create({
                moduleId: mod1._id,
                title: { pt: 'Aula 2 - Configurações Iniciais', en: 'Lesson 2 - Initial Settings' },
                description: { pt: 'Configurando o ambiente de trabalho', en: 'Setting up the work environment' },
                order: 2,
                materials: []
            });

            await Lesson.create({
                moduleId: mod2._id,
                title: { pt: 'Aula 1 - Linhas e Formas Básicas', en: 'Lesson 1 - Lines and Basic Shapes' },
                description: { pt: 'Desenhando linhas, retângulos e círculos', en: 'Drawing lines, rectangles and circles' },
                order: 1,
                materials: []
            });

            console.log('✅ Sample course created with modules and lessons');
        }

        console.log('\n🎉 Database seeding completed!');
        console.log('\n📧 Login credentials:');
        console.log(`   Superadmin: ${process.env.SUPERADMIN_EMAIL || 'superadmin@muvacademy.co.mz'} / ${process.env.SUPERADMIN_PASSWORD || 'Super@123456'}`);
        console.log(`   Admin: ${process.env.ADMIN_EMAIL || 'admin@muvacademy.co.mz'} / ${process.env.ADMIN_PASSWORD || 'Admin@123456'}`);
        console.log(`   Client: ${clientEmail} / @Cliente123@`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding error:', error);
        process.exit(1);
    }
};

seedDatabase();
