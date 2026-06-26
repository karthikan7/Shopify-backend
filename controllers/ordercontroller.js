const Order = require('../model/order');
const sendEmail = require('../utils/sendEmail');

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

    // ✅ SEND EMAIL ASYNC (DO NOT BLOCK RESPONSE)
    setImmediate(() => {
      sendEmail({
        email: req.user.email,
        subject: 'ShopNest - Order Confirmation',
        message: `
          <h2>Order Confirmation</h2>
          <p>Hello ${req.user.name},</p>
          <p>Order ID: ${createdOrder._id}</p>
          <p>Total: ₹${totalAmount.toFixed(2)}</p>
        `
      }).catch(err => console.error('Email error:', err));
    });

    return res.status(201).json(createdOrder);

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};