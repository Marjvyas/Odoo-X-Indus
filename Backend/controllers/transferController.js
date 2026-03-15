const Transfer = require('../models/Transfer');
const Product = require('../models/Product');

// @desc    Create a transfer
// @route   POST /api/transfers
// @access  Private/Owner
const createTransfer = async (req, res) => {
  try {
    const { productId, quantity, fromLocation, toLocation } = req.body;

    const transfer = await Transfer.create({
      productId,
      quantity,
      fromLocation,
      toLocation,
      status: 'pending',
    });

    res.status(201).json(transfer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all transfers
// @route   GET /api/transfers
// @access  Private/Employee
const getTransfers = async (req, res) => {
  try {
    const transfers = await Transfer.find({})
      .populate('productId', 'name sku unit')
      .sort({ createdAt: -1 });
    res.json(transfers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Complete a transfer
// @route   PATCH /api/transfers/:id/complete
// @access  Private/Employee
const completeTransfer = async (req, res) => {
  try {
    const transfer = await Transfer.findById(req.params.id);

    if (!transfer) {
      return res.status(404).json({ message: 'Transfer not found' });
    }

    if (transfer.status === 'completed') {
      return res.status(400).json({ message: 'Transfer is already completed' });
    }

    transfer.status = 'completed';
    await transfer.save();

    res.json(transfer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createTransfer,
  getTransfers,
  completeTransfer,
};
