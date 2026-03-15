const Adjustment = require('../models/Adjustment');
const Product = require('../models/Product');

// @desc    Adjust inventory stock
// @route   POST /api/adjustments
// @access  Private/Owner
const adjustInventory = async (req, res) => {
  try {
    const { productId, newStock, reason } = req.body;

    if (newStock === undefined || newStock < 0) {
      return res.status(400).json({ message: 'Valid new stock is required' });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const previousStock = product.stock;
    const difference = newStock - previousStock;

    product.stock = newStock;
    await product.save();

    const adjustment = await Adjustment.create({
      productId,
      previousStock,
      newStock,
      difference,
      reason,
    });

    res.status(201).json({
      message: 'Inventory adjusted successfully',
      adjustment,
      product,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  adjustInventory,
};
