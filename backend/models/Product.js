const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: [true, 'Please add a product title'],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  price: {
    type: Number,
    required: [true, 'Please add a price'],
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
    trim: true,
  },
  stock: {
    type: Number,
    required: [true, 'Please add stock level'],
    default: 0,
  },
  tags: {
    type: [String],
    default: [],
  },
  marketingCaption: {
    type: String,
    trim: true,
  },
  salesVelocity: {
    type: Number, // units sold per month (used for mock analytics / AI pricing advices)
    default: 0,
  },
  revenue: {
    type: Number, // total accumulated revenue (units * price)
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Product', ProductSchema);
