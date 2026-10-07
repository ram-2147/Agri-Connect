const Product = require('../models/Product');

const listProducts = async (req, res) => {
  try {
    const { search, category, farmerId } = req.query;
    const filter = { isActive: true };

    if (category) filter.category = category;
    if (farmerId) filter.farmerId = farmerId;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const products = await Product.find(filter)
      .populate('farmerId', 'name farmerProfile.farmName farmerProfile.location')
      .sort({ createdAt: -1 });

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      'farmerId',
      'name phone farmerProfile'
    );
    if (!product || !product.isActive) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createProduct = async (req, res) => {
  try {
    const { name, category, description, price, unit, stock, imageUrl } = req.body;
    if (!name || !category || price === undefined || stock === undefined) {
      return res.status(400).json({ message: 'Name, category, price and stock are required' });
    }

    const product = await Product.create({
      farmerId: req.user._id,
      name,
      category,
      description: description || '',
      price: Number(price),
      unit: unit || 'kg',
      stock: Number(stock),
      imageUrl: imageUrl || '',
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyProducts = async (req, res) => {
  try {
    const products = await Product.find({ farmerId: req.user._id }).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const isOwner = product.farmerId.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: 'Not allowed to update this product' });
    }

    const fields = ['name', 'category', 'description', 'price', 'unit', 'stock', 'imageUrl', 'isActive'];
    fields.forEach((field) => {
      if (req.body[field] !== undefined) product[field] = req.body[field];
    });

    await product.save();
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const isOwner = product.farmerId.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: 'Not allowed to delete this product' });
    }

    product.isActive = false;
    await product.save();
    res.json({ message: 'Product deactivated' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  listProducts,
  getProduct,
  createProduct,
  getMyProducts,
  updateProduct,
  deleteProduct,
};
