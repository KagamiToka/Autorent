const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  laptopId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Laptop', 
    required: true 
  },
  quantity: { 
    type: Number, 
    required: [true, 'Số lượng đặt hàng là bắt buộc'],
    min: [1, 'Số lượng đặt hàng phải ít nhất là 1']
  },
  orderDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);