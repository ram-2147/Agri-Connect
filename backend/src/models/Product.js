const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    farmerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ['vegetables', 'fruits', 'grains', 'dairy', 'other'],
      required: true,
    },
    description: { type: String, default: '' },
    price: { type: Number, required: true, min: 0 },
    unit: {
      type: String,
      enum: ['kg', 'quintal', 'dozen', 'litre', 'piece'],
      default: 'kg',
    },
    stock: { type: Number, required: true, min: 0 },
    imageUrl: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
