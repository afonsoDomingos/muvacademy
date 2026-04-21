import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: false,
    default: 0
  },
  images: {
    type: [String],
    default: ['https://images.unsplash.com/photo-1509391366360-fe19a78e729b?auto=format&fit=crop&w=800&q=80']
  },
  category: {
    type: String,
    enum: ['solar', 'lighting', 'accessories', 'other'],
    default: 'other'
  },
  stock: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  stats: {
    clicks: { type: Number, default: 0 }
  },
  order: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);
export default Product;
