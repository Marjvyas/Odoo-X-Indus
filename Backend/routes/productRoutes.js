const express = require('express');
const router = express.Router();
const {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.route('/')
  .post(protect, authorize('owner'), createProduct)
  .get(protect, getProducts); // Both Owner and Employee can get products

router.route('/:id')
  .patch(protect, authorize('owner'), updateProduct)
  .delete(protect, authorize('owner'), deleteProduct);

module.exports = router;
