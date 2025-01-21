 
const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  model: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  available: {
    type: Boolean,
    default: true,
  },
  imageUrl: String,
  description: String,
  features: [String],
}, { timestamps: true });

const Car = mongoose.model('Car', carSchema);

module.exports = Car;