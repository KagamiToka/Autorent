const User = require('../models/userModel');
const Order = require('../models/orderModel');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const LUser = await User.findById(userId);
    if (!LUser) {
      return res.status(404).json({ message: "User không tồn tại" });
    }
    const existingOrder = await Order.findOne({ userId: userId });
    
    if (existingOrder) {
      return res.status(400).json({ message: "Cannot delete users with existing orders." });
    }

    await User.findByIdAndDelete(userId);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const newUser = new User({ 
      username: username,
      password: password
    });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username: username, password: password });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "Login successful", user: user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

