const mongoose = require('mongoose');

const transferSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    fromLocation: {
      type: String,
      required: [true, 'Please specify source location'],
    },
    toLocation: {
      type: String,
      required: [true, 'Please specify destination location'],
    },
    status: {
      type: String,
      enum: ['pending', 'completed'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Transfer', transferSchema);
