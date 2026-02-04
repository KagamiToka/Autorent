const Order = require('../models/orderModel');
const Laptop = require('../models/laptopModel');
const User = require('../models/userModel');

exports.createOrder = async (req, res) => {
  try {
    const { userId, laptopId, quantity } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User không tồn tại" });
    }
    
    const laptop = await Laptop.findById(laptopId);
    if (!laptop) {
      return res.status(404).json({ message: "Laptop không tồn tại" });
    }

    if (laptop.stockQuantity < quantity) {
      return res.status(400).json({ message: `Kho không đủ hàng. Chỉ còn ${laptop.stockQuantity}` });
    }

    if (!Number.isInteger(quantity)) {
      return res.status(400).json({ message: "Số lượng đặt hàng phải là một số hợp lệ" });
    }

    laptop.stockQuantity -= quantity;
    await laptop.save();

    const newOrder = new Order({
      userId,
      laptopId,
      quantity,
      orderDate: new Date()
    });

    await newOrder.save();
    res.status(201).json(newOrder);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('userId', 'username')
      .populate('laptopId', 'name brand price');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getOrdersByDate = async (req, res) => {
  try {
    const { start, end } = req.query;
    
    if (!start || !end) {
      return res.status(400).json({ message: "Vui lòng cung cấp cả ngày bắt đầu (start) và ngày kết thúc (end)" });
    }

    const datePattern = /^\d{4}-\d{2}-\d{2}$/;

    if (!datePattern.test(start) || !datePattern.test(end)) {
      return res.status(400).json({ message: "Định dạng ngày không hợp lệ. Vui lòng sử dụng định dạng YYYY-MM-DD (Ví dụ: 2024-01-30)" });
    }

    const startDate = new Date(start);
    const endDate = new Date(end);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return res.status(400).json({ message: "Ngày không tồn tại hoặc không hợp lệ" });
    }

    if (startDate >= endDate) {
      return res.status(400).json({ message: "Invalid range: start date must be before end date" });
    }

    endDate.setHours(23, 59, 59, 999);

    const orders = await Order.find({
      orderDate: {
        $gte: startDate,
        $lte: endDate
      }
    }).populate('userId laptopId');

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};