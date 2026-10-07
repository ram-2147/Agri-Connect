const express = require('express');
const {
  listProducts,
  getProduct,
  createProduct,
  getMyProducts,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const { protect } = require('../middleware/auth');
const { authorize, requireApprovedFarmer } = require('../middleware/role');

const router = express.Router();

router.get('/', listProducts);
router.get('/mine/list', protect, authorize('farmer'), getMyProducts);
router.get('/:id', getProduct);
router.post('/', protect, authorize('farmer'), requireApprovedFarmer, createProduct);
router.put('/:id', protect, authorize('farmer', 'admin'), updateProduct);
router.delete('/:id', protect, authorize('farmer', 'admin'), deleteProduct);

module.exports = router;
