const mongoose = require('mongoose');

const farmRecordSchema = new mongoose.Schema(
  {
    farmerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    cropName: { type: String, required: true, trim: true },
    season: {
      type: String,
      enum: ['kharif', 'rabi', 'zaid', 'year-round'],
      default: 'kharif',
    },
    areaAcres: { type: Number, required: true, min: 0 },
    expectedYield: { type: String, default: '' },
    notes: { type: String, default: '' },
    status: {
      type: String,
      enum: ['planned', 'growing', 'harvested'],
      default: 'planned',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('FarmRecord', farmRecordSchema);
