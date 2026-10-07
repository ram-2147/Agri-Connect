const express = require('express');
const {
  getFarmProfile,
  updateFarmProfile,
  getDashboard,
  listRecords,
  createRecord,
  updateRecord,
  deleteRecord,
} = require('../controllers/farmerController');
const { protect } = require('../middleware/auth');
const { authorize, requireApprovedFarmer } = require('../middleware/role');

const router = express.Router();

router.use(protect, authorize('farmer'));

router.get('/profile', getFarmProfile);
router.put('/profile', updateFarmProfile);
router.get('/dashboard', requireApprovedFarmer, getDashboard);
router.get('/records', requireApprovedFarmer, listRecords);
router.post('/records', requireApprovedFarmer, createRecord);
router.put('/records/:id', requireApprovedFarmer, updateRecord);
router.delete('/records/:id', requireApprovedFarmer, deleteRecord);

module.exports = router;
