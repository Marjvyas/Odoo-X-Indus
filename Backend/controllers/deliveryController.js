const Delivery = require('../models/Delivery');
const Product = require('../models/Product');

// @desc    Create a delivery
// @route   POST /api/deliveries
// @access  Private/Owner
const createDelivery = async (req, res) => {
  try {
    const { customerName, products } = req.body;

    if (!products || products.length === 0) {
      return res.status(400).json({ message: 'No delivery products' });
    }

    const delivery = await Delivery.create({
      customerName,
      products,
      createdBy: req.user._id,
      status: 'created',
    });

    res.status(201).json(delivery);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all deliveries
// @route   GET /api/deliveries
// @access  Private/Employee
const getDeliveries = async (req, res) => {
  try {
    const deliveries = await Delivery.find({})
      .populate('products.productId', 'name sku unit')
      .populate('createdBy', 'name')
      .populate('updatedBy', 'name')
      .sort({ createdAt: -1 });
    res.json(deliveries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mark delivery as dispatched
// @route   PATCH /api/deliveries/:id/dispatch
// @access  Private/Employee
const dispatchDelivery = async (req, res) => {
  try {
    const delivery = await Delivery.findById(req.params.id);

    if (!delivery) {
      return res.status(404).json({ message: 'Delivery not found' });
    }

    if (delivery.status !== 'created') {
      return res.status(400).json({ message: 'Can only dispatch created orders' });
    }

    delivery.status = 'dispatched';
    delivery.updatedBy = req.user._id;
    await delivery.save();

    res.json(delivery);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mark delivery as delivered
// @route   PATCH /api/deliveries/:id/deliver
// @access  Private/Employee
const deliverDelivery = async (req, res) => {
  try {
    const delivery = await Delivery.findById(req.params.id);

    if (!delivery) {
      return res.status(404).json({ message: 'Delivery not found' });
    }

    if (delivery.status !== 'dispatched') {
      return res.status(400).json({ message: 'Can only deliver dispatched orders' });
    }

    // Update stock for each item
    for (const item of delivery.products) {
      const product = await Product.findById(item.productId);
      
      if (!product) {
        return res.status(404).json({ message: `Product ${item.productId} not found` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Not enough stock for ${product.name}` });
      }

      product.stock -= item.quantity;
      await product.save();
    }

    delivery.status = 'delivered';
    delivery.updatedBy = req.user._id;
    await delivery.save();

    res.json(delivery);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createDelivery,
  getDeliveries,
  dispatchDelivery,
  deliverDelivery,
};
