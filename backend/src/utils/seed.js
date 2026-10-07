require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const FarmRecord = require('../models/FarmRecord');

const seed = async () => {
  try {
    await connectDB();

    await Promise.all([
      User.deleteMany({}),
      Product.deleteMany({}),
      Order.deleteMany({}),
      FarmRecord.deleteMany({}),
    ]);

    const admin = await User.create({
      name: 'Platform Admin',
      email: 'admin@agriconnect.com',
      password: 'Admin@123',
      role: 'admin',
      phone: '9000000001',
    });

    const farmer = await User.create({
      name: 'Ramesh Kumar',
      email: 'farmer@agriconnect.com',
      password: 'Farmer@123',
      role: 'farmer',
      phone: '9000000002',
      address: 'Village Greenfields, Nashik',
      farmerProfile: {
        farmName: 'Green Valley Farm',
        location: 'Nashik, Maharashtra',
        crops: ['Tomato', 'Onion', 'Wheat'],
        approved: true,
      },
    });

    const farmer2 = await User.create({
      name: 'Sita Devi',
      email: 'farmer2@agriconnect.com',
      password: 'Farmer@123',
      role: 'farmer',
      phone: '9000000004',
      address: 'Punjab Plains',
      farmerProfile: {
        farmName: 'Sunrise Orchards',
        location: 'Ludhiana, Punjab',
        crops: ['Apple', 'Mango'],
        approved: false,
      },
    });

    const buyer = await User.create({
      name: 'Anita Sharma',
      email: 'buyer@agriconnect.com',
      password: 'Buyer@123',
      role: 'buyer',
      phone: '9000000003',
      address: '12 Market Road, Pune',
    });

    await Product.insertMany([
      {
        farmerId: farmer._id,
        name: 'Organic Tomatoes',
        category: 'vegetables',
        description: 'Fresh vine-ripened organic tomatoes from Nashik farms.',
        price: 40,
        unit: 'kg',
        stock: 200,
        imageUrl:
          'https://images.unsplash.com/photo-1546470427-e26264be0b0d?w=800&q=80',
      },
      {
        farmerId: farmer._id,
        name: 'Red Onions',
        category: 'vegetables',
        description: 'Premium red onions, ideal for kitchens and restaurants.',
        price: 28,
        unit: 'kg',
        stock: 500,
        imageUrl:
          'https://images.unsplash.com/photo-1518977822534-7049a61ee0c2?w=800&q=80',
      },
      {
        farmerId: farmer._id,
        name: 'Sharbati Wheat',
        category: 'grains',
        description: 'High-protein wheat grain, cleaned and farm-direct.',
        price: 3200,
        unit: 'quintal',
        stock: 40,
        imageUrl:
          'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&q=80',
      },
      {
        farmerId: farmer._id,
        name: 'Farm Fresh Milk',
        category: 'dairy',
        description: 'Daily collected cow milk, chilled and packed.',
        price: 55,
        unit: 'litre',
        stock: 100,
        imageUrl:
          'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=800&q=80',
      },
      {
        farmerId: farmer._id,
        name: 'Alphonso Mangoes',
        category: 'fruits',
        description: 'Seasonal Alphonso mangoes — sweet and aromatic.',
        price: 350,
        unit: 'dozen',
        stock: 60,
        imageUrl:
          'https://images.unsplash.com/photo-1553279768-865429fa0078?w=800&q=80',
      },
    ]);

    await FarmRecord.create({
      farmerId: farmer._id,
      cropName: 'Tomato',
      season: 'rabi',
      areaAcres: 2.5,
      expectedYield: '18 tonnes',
      notes: 'Drip irrigation installed',
      status: 'growing',
    });

    console.log('Seed complete.');
    console.log('Admin : admin@agriconnect.com / Admin@123');
    console.log('Farmer: farmer@agriconnect.com / Farmer@123');
    console.log('Buyer : buyer@agriconnect.com / Buyer@123');
    console.log(`Pending farmer (for admin approve demo): farmer2@agriconnect.com`);
    console.log(`IDs — admin:${admin._id} farmer:${farmer._id} buyer:${buyer._id} pending:${farmer2._id}`);

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seed();
