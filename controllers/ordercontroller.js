const Order = require('../model/order');
const sendEmail = require('../utils/sendEmail');

/* -------------------- CREATE ORDER -------------------- */
const addOrderItems = async (req, res) => {
  try {
    const { items, totalAmount, address, paymentId } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    const order = new Order({
      userId: req.user._id,
      items,
      totalAmount,
      address,
      paymentId
    });

    const createdOrder = await order.save();

    // async email (non-blocking)
    setImmediate(() => {
      sendEmail({
        email: req.user.email,
        subject: 'ShopNest - Order Confirmation',
        message: `
          <h2>Order Confirmation</h2>
          <p>Hello ${req.user.name},</p>
          <p>Your order has been placed successfully.</p>
          <p>Order ID: <strong>${createdOrder._id}</strong></p>
          <p>Total Amount: ₹${totalAmount.toFixed(2)}</p>
        `
      }).catch(err => console.error('Email error:', err));
    });

    return res.status(201).json(createdOrder);

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/* -------------------- GET USER ORDERS -------------------- */
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id })
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* -------------------- GET ALL ORDERS (ADMIN) -------------------- */
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('userId', '_id name email')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* -------------------- UPDATE ORDER STATUS -------------------- */
const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = req.body.status || order.status;

    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* -------------------- EXPORT -------------------- */
module.exports = {
  addOrderItems,
  getMyOrders,
  getOrders,
  updateOrderStatus
};