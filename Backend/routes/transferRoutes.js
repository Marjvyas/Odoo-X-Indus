const express = require('express');
const router = express.Router();
const {
  createTransfer,
  getTransfers,
  completeTransfer,
} = require('../controllers/transferController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.route('/')
  .post(protect, authorize('owner'), createTransfer)
  .get(protect, authorize('employee'), getTransfers);

router.route('/:id/complete')
  .patch(protect, authorize('employee'), completeTransfer);

module.exports = router;
