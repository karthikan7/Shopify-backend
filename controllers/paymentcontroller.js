const Razorpay = require('razorpay');
const crypto = require('crypto');

const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const createOrder = async (req, res) => {
  try {
    const amount = Number(req.body.amount);

    if (!Number.isFinite(amount) || amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    const options = {
      amount: Math.round(amount * 100),
      currency: "INR",
    };

    const order = await instance.orders.create(options);

    return res.json(order);
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Payment initialization failed"
    });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const sign = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign)
      .digest("hex");

    if (expectedSign === razorpay_signature) {
      return res.json({ message: "Payment verified successfully" });
    }

    return res.status(400).json({ message: "Invalid signature" });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { createOrder, verifyPayment };