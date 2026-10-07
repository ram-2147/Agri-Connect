const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const farmerProfileSchema = new mongoose.Schema(
  {
    farmName: { type: String, default: '' },
    location: { type: String, default: '' },
    crops: [{ type: String }],
    approved: { type: Boolean, default: false },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, minlength: 6, select: false },
    role: {
      type: String,
      enum: ['buyer', 'farmer', 'admin'],
      default: 'buyer',
    },
    phone: { type: String, default: '' },
    address: { type: String, default: '' },
    farmerProfile: { type: farmerProfileSchema, default: () => ({}) },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

userSchema.pre('save', async function hashPassword() {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.matchPassword = async function matchPassword(entered) {
  return bcrypt.compare(entered, this.password);
};

module.exports = mongoose.model('User', userSchema);
