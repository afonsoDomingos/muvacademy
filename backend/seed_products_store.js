import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Product } from './src/models/index.js';

dotenv.config();

const products = [
  {
    name: 'SOLAR PORTABLE FLOOD LIGHT',
    description: 'Sistema de iluminação solar portátil de alta eficiência, ideal para uso externo e emergências.',
    price: 2400,
    image: 'https://images.unsplash.com/photo-1509391366360-fe19a78e729b?auto=format&fit=crop&w=800&q=80',
    category: 'solar',
    stock: 20,
    isActive: true,
    order: 1
  },
  {
    name: 'LÂMPADA DE CARREGAMENTO LED',
    description: 'Lâmpada LED recarregável versátil com longa duração de bateria e múltiplos modos de luz.',
    price: 500,
    image: 'https://images.unsplash.com/photo-1540331547168-8b63109225b7?auto=format&fit=crop&w=800&q=80',
    category: 'lighting',
    stock: 50,
    isActive: true,
    order: 2
  }
];

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    await Product.deleteMany({});
    console.log('Deleted existing products');

    await Product.insertMany(products);
    console.log('Inserted seed products');

    mongoose.connection.close();
    console.log('Connection closed');
  } catch (error) {
    console.error('Error seeding products:', error);
    process.exit(1);
  }
};

seedProducts();
