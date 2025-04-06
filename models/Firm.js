const mongoose = require('mongoose');

const firmSchema = new mongoose.Schema({
  firmName: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  area: {
    type: String,
    required: true,
    trim: true
  },
  category: [{
    type: String,
    enum: ['veg', 'non-veg'],
    required: true
  }],
  region: [{
    type: String,
    enum: ['south-indian', 'north-indian', 'chinese', 'bakery'],
    required: true
  }],
  offer: {
    type: String,
    default: '',
    trim: true
  },
  image: {
    type: String,
    default: ''
  },
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor',
    required: true
  },
  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }]
}, { timestamps: true });

const Firm = mongoose.model('Firm', firmSchema);
module.exports = Firm;
