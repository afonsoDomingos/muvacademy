import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Banner from './src/models/Banner.js';
import Service from './src/models/Service.js';

dotenv.config({ path: 'backend/.env' });

async function checkContent() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const banners = await Banner.find({ active: true });
        const services = await Service.find();
        
        console.log('--- CONTENT CHECK ---');
        console.log('Active Banners:', banners.length);
        banners.forEach(b => console.log(`- ${b.title.pt}`));
        
        console.log('Services:', services.length);
        services.forEach(s => console.log(`- ${s.title.pt}`));
        
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

checkContent();
