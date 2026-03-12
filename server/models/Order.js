const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      food: { type: mongoose.Schema.Types.ObjectId, ref: 'Food' },
      name: String,
      price: Number,
      quantity: Number,
    }
  ],
  totalAmount: { type: Number, required: true },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered'],
    default: 'Pending'
  },
  paymentStatus: { type: String, enum: ['Paid', 'Unpaid'], default: 'Unpaid' },
  address: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);