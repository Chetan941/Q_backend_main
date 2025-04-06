const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  firm: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Firm',
    default: null
  }
}, { timestamps: true });

const Vendor = mongoose.model('Vendor', vendorSchema);

module.exports = Vendor;
