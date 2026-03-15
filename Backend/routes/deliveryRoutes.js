const express = require('express');
const router = express.Router();
const {
  createDelivery,
  getDeliveries,
  dispatchDelivery,
  deliverDelivery,
} = require('../controllers/deliveryController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.route('/')
  .post(protect, authorize('owner'), createDelivery)
  .get(protect, authorize('employee'), getDeliveries);

router.route('/:id/dispatch')
  .patch(protect, authorize('employee'), dispatchDelivery);

router.route('/:id/deliver')
  .patch(protect, authorize('employee'), deliverDelivery);

module.exports = router;
