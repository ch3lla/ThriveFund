require('dotenv').config();
const express = require('express');
const { json, urlencoded } = require('express');
const cors = require('cors');
const db = require('./config/db');
const cloudinary = require('cloudinary').v2;

const apiRoutes = require('./routes/index');

const app = express();
// connecting database
db();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});


const corsOptions = {
  origin: ['http://localhost:5173', 'https://thrivefund.vercel.app'],
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};

// middlewares
app.use(cors(corsOptions));
app.use(json({ limit: '50mb' }));
app.use(urlencoded({ limit: '50mb', extended: true }));

// routes
app.use('/api/v1', apiRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on localhost:${process.env.PORT}`);
});