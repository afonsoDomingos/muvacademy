import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'O título é obrigatório'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'A categoria é obrigatória'],
    default: 'web'
  },
  description: {
    type: String,
    required: [true, 'A descrição é obrigatória']
  },
  images: {
    type: [String],
    default: []
  },
  tags: [String],
  link: {
    type: String,
    default: '#'
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

const Project = mongoose.model('Project', projectSchema);

export default Project;
