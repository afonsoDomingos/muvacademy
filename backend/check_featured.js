import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Course from './src/models/Course.js';

dotenv.config();

const checkFeatured = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('📦 Connected to MongoDB');

        // Query exactly like controller
        const courses = await Course.find({ published: true, featured: true })
            .select('title.pt featured published')
            .limit(6);

        console.log(`\n🔍 Found ${courses.length} featured courses:`);
        courses.forEach(c => {
            console.log(`- ${c.title?.pt} (Featured: ${c.featured}, Published: ${c.published})`);
        });

        if (courses.length === 0) {
            console.log('\n⚠️ No featured courses found! Checking generally related courses...');
            const potential = await Course.find({}).limit(5).select('title.pt featured published');
            potential.forEach(c => {
                console.log(`  ? ${c.title?.pt} -> Featured: ${c.featured}, Published: ${c.published}`);
            });
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

checkFeatured();
