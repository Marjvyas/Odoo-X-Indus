const express = require('express');
const router = express.Router();
const { adjustInventory } = require('../controllers/adjustmentController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.route('/')
  .post(protect, authorize('owner'), adjustInventory);

module.exports = router;
