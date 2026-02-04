const mongoose = require('mongoose');

const laptopSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Tên laptop là bắt buộc'],
    trim: true
  },
  brand: { 
    type: String, 
    required: [true, 'Hãng sản xuất là bắt buộc'],
    trim: true
  },
  price: { 
    type: Number, 
    required: [true, 'Giá là bắt buộc'],
    min: [0, 'Giá không được nhỏ hơn 0']
  },
  stockQuantity: { 
    type: Number, 
    required: [true, 'Số lượng kho là bắt buộc'],
    min: [0, 'Số lượng tồn kho không được âm']
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Laptop', laptopSchema);