const express = require('express');
const {
  placeOrder,
  getMyOrders,
  getFarmerOrders,
  updateOrderStatus,
  getAllOrders,
} = require('../controllers/orderController');
const { protect } = require('../middleware/auth');
const { authorize, requireApprovedFarmer } = require('../middleware/role');

const router = express.Router();

router.post('/', protect, authorize('buyer'), placeOrder);
router.get('/mine', protect, authorize('buyer'), getMyOrders);
router.get('/farmer', protect, authorize('farmer'), requireApprovedFarmer, getFarmerOrders);
router.get('/all', protect, authorize('admin'), getAllOrders);
router.put('/:id/status', protect, authorize('buyer', 'farmer', 'admin'), updateOrderStatus);

module.exports = router;
