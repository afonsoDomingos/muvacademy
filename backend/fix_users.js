import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User.js';

dotenv.config();

const fixUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('📦 Connected to MongoDB');

        // Emails e Senhas desejados
        const usersToCreate = [
            {
                name: 'Super Admin',
                email: 'superadmin@muvacademy.co.mz',
                password: '@SuperAdmin123@',
                role: 'superadmin'
            },
            {
                name: 'Admin MUV',
                email: 'admin@muvacademy.co.mz',
                password: '@Admin123@',
                role: 'admin'
            },
            {
                name: 'Cliente Teste',
                email: 'cliente@muvacademy.co.mz',
                password: '@Cliente123@',
                role: 'cliente'
            }
        ];

        for (const uData of usersToCreate) {
            // Remover se já existir para garantir a senha e role
            await User.deleteOne({ email: uData.email });

            await User.create({
                ...uData,
                isActive: true,
                language: 'pt'
            });
            console.log(`✅ Usuário ${uData.email} (re)criado com sucesso.`);
        }

        console.log('\n🚀 Todos os usuários foram resetados com as credenciais padrão do .env!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Erro:', error);
        process.exit(1);
    }
};

fixUsers();
