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

/* CORS CONFIG */
const corsOptions = {
    origin: [
        'https://shopfrontend-khaki.vercel.app',
        'http://localhost:3000'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

/* MIDDLEWARES */
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/* FIX FOR OPTIONS REQUEST (Render-safe) */
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "https://shopfrontend-khaki.vercel.app");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");

    if (req.method === "OPTIONS") {
        return res.sendStatus(200);
    }

    next();
});

/* ROUTES */
app.get('/', (req, res) => {
    res.send('Backend is running');
});

app.use('/auth', userroute);
app.use('/products', productroute);
app.use('/order', orderroute);
app.use('/payment', paymentroute);
app.use('/analytics', Analytic);

/* SERVER */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});