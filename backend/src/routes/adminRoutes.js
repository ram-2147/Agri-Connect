const express = require('express');
const {
  getStats,
  listUsers,
  approveFarmer,
  toggleUserActive,
  listAllProducts,
  toggleProduct,
} = require('../controllers/adminController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/role');

const router = express.Router();

router.use(protect, authorize('admin'));

router.get('/stats', getStats);
router.get('/users', listUsers);
router.put('/farmers/:id/approve', approveFarmer);
router.put('/users/:id/toggle', toggleUserActive);
router.get('/products', listAllProducts);
router.put('/products/:id/toggle', toggleProduct);

module.exports = router;
