const User = require('../models/User');
const FarmRecord = require('../models/FarmRecord');
const Product = require('../models/Product');
const Order = require('../models/Order');

const getFarmProfile = async (req, res) => {
  res.json({
    name: req.user.name,
    email: req.user.email,
    phone: req.user.phone,
    address: req.user.address,
    farmerProfile: req.user.farmerProfile,
  });
};

const updateFarmProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const { farmName, location, crops, phone, address } = req.body;

    if (phone !== undefined) user.phone = phone;
    if (address !== undefined) user.address = address;
    if (farmName !== undefined) user.farmerProfile.farmName = farmName;
    if (location !== undefined) user.farmerProfile.location = location;
    if (crops !== undefined) {
      user.farmerProfile.crops = Array.isArray(crops)
        ? crops
        : String(crops)
            .split(',')
            .map((c) => c.trim())
            .filter(Boolean);
    }

    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getDashboard = async (req, res) => {
  try {
    const farmerId = req.user._id;
    const products = await Product.countDocuments({ farmerId, isActive: true });
    const records = await FarmRecord.countDocuments({ farmerId });
    const orders = await Order.find({ 'items.farmerId': farmerId });
    const pendingOrders = orders.filter((o) => o.status === 'pending').length;
    let revenue = 0;
    orders.forEach((order) => {
      if (order.status === 'cancelled') return;
      order.items.forEach((item) => {
        if (item.farmerId.toString() === farmerId.toString()) {
          revenue += item.price * item.qty;
        }
      });
    });

    res.json({
      products,
      records,
      totalOrders: orders.length,
      pendingOrders,
      revenue,
      approved: req.user.farmerProfile?.approved || false,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const listRecords = async (req, res) => {
  try {
    const records = await FarmRecord.find({ farmerId: req.user._id }).sort({ createdAt: -1 });
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createRecord = async (req, res) => {
  try {
    const { cropName, season, areaAcres, expectedYield, notes, status } = req.body;
    if (!cropName || areaAcres === undefined) {
      return res.status(400).json({ message: 'Crop name and area are required' });
    }
    const record = await FarmRecord.create({
      farmerId: req.user._id,
      cropName,
      season: season || 'kharif',
      areaAcres: Number(areaAcres),
      expectedYield: expectedYield || '',
      notes: notes || '',
      status: status || 'planned',
    });
    res.status(201).json(record);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateRecord = async (req, res) => {
  try {
    const record = await FarmRecord.findById(req.params.id);
    if (!record) return res.status(404).json({ message: 'Record not found' });
    if (record.farmerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not allowed' });
    }

    const fields = ['cropName', 'season', 'areaAcres', 'expectedYield', 'notes', 'status'];
    fields.forEach((f) => {
      if (req.body[f] !== undefined) record[f] = req.body[f];
    });
    await record.save();
    res.json(record);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteRecord = async (req, res) => {
  try {
    const record = await FarmRecord.findById(req.params.id);
    if (!record) return res.status(404).json({ message: 'Record not found' });
    if (record.farmerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not allowed' });
    }
    await record.deleteOne();
    res.json({ message: 'Record deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getFarmProfile,
  updateFarmProfile,
  getDashboard,
  listRecords,
  createRecord,
  updateRecord,
  deleteRecord,
};
