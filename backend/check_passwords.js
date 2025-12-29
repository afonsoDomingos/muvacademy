import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User.js';

dotenv.config();

const verifyPasswords = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const users = await User.find({}).select('+password');

        console.log('--- Verificação de Senhas ---');
        for (const user of users) {
            const passwordsToTry = [
                '@Cliente123@',
                '@Admin123@',
                '@SuperAdmin123@',
                'Super@123456',
                'Admin@123456'
            ];

            let matched = 'NENHUMA MATCH';
            for (const pw of passwordsToTry) {
                if (await user.comparePassword(pw)) {
                    matched = pw;
                    break;
                }
            }
            console.log(`User: ${user.email} | Role: ${user.role} | Password Match: ${matched}`);
        }
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

verifyPasswords();
