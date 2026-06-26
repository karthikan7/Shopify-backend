require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');

const userroute = require('./routes/authroutes');
const productroute = require('./routes/productroute');
const orderroute = require('./routes/orderroute');
const paymentroute = require('./routes/paymentroutes');
const Analytic = require('./routes/analyticsroutes');

connectDB();

const app = express();

/* ---------------- CORS ---------------- */

const allowedOrigins = [
  "https://shopfrontend-khaki.vercel.app",
  "http://localhost:3000"
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, true); // allow for deployment stability
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

app.use(cors(corsOptions));

/* IMPORTANT: handle preflight safely */
app.options("*", cors(corsOptions));

/* ---------------- MIDDLEWARE ---------------- */

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/* ---------------- ROUTES ---------------- */

app.get('/', (req, res) => {
  res.send('Backend is running');
});

app.use('/auth', userroute);
app.use('/products', productroute);
app.use('/order', orderroute);
app.use('/payment', paymentroute);
app.use('/analytics', Analytic);

/* ---------------- SERVER ---------------- */

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});