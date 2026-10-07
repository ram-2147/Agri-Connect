const Order = require('../models/Order');
const Product = require('../models/Product');

const placeOrder = async (req, res) => {
  try {
    const { items, shippingAddress } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Order items are required' });
    }
    if (!shippingAddress) {
      return res.status(400).json({ message: 'Shipping address is required' });
    }

    const orderItems = [];
    let totalAmount = 0;

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product || !product.isActive) {
        return res.status(400).json({ message: `Product not available: ${item.productId}` });
      }
      const qty = Number(item.qty);
      if (!qty || qty < 1) {
        return res.status(400).json({ message: `Invalid quantity for ${product.name}` });
      }
      if (product.stock < qty) {
        return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
      }

      orderItems.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        qty,
        unit: product.unit,
        farmerId: product.farmerId,
      });
      totalAmount += product.price * qty;
    }

    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.qty },
      });
    }

    const order = await Order.create({
      buyerId: req.user._id,
      items: orderItems,
      totalAmount,
      shippingAddress,
      paymentMethod: 'COD',
      status: 'pending',
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ buyerId: req.user._id })
      .populate('items.farmerId', 'name farmerProfile.farmName')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getFarmerOrders = async (req, res) => {
  try {
    const orders = await Order.find({ 'items.farmerId': req.user._id })
      .populate('buyerId', 'name email phone address')
      .sort({ createdAt: -1 });

    const filtered = orders.map((order) => {
      const obj = order.toObject();
      obj.items = obj.items.filter(
        (item) => item.farmerId.toString() === req.user._id.toString()
      );
      obj.farmerSubtotal = obj.items.reduce((sum, i) => sum + i.price * i.qty, 0);
      return obj;
    });

    res.json(filtered);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const isAdmin = req.user.role === 'admin';
    const isFarmerOnOrder =
      req.user.role === 'farmer' &&
      order.items.some((i) => i.farmerId.toString() === req.user._id.toString());
    const isBuyer = order.buyerId.toString() === req.user._id.toString();

    if (status === 'cancelled') {
      if (!isBuyer && !isAdmin) {
        return res.status(403).json({ message: 'Only buyer or admin can cancel' });
      }
      if (!['pending', 'confirmed'].includes(order.status) && !isAdmin) {
        return res.status(400).json({ message: 'Order can no longer be cancelled' });
      }
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.productId, { $inc: { stock: item.qty } });
      }
    } else if (!isAdmin && !isFarmerOnOrder) {
      return res.status(403).json({ message: 'Not allowed to update this order' });
    }

    order.status = status;
    await order.save();
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('buyerId', 'name email')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  placeOrder,
  getMyOrders,
  getFarmerOrders,
  updateOrderStatus,
  getAllOrders,
};
