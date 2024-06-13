require('dotenv').config();
const express = require('express');
const { json, urlencoded } = require('express');
const cors = require('cors');
const db = require('./config/db');
const cloudinary = require('cloudinary').v2;
const fileUpload = require("express-fileupload");
const { startSocketServer } = require('./helpers/socket');
const morgan = require('morgan');

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
app.use(express.json({
  limit: '50mb',
  verify: (req, res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(urlencoded({ limit: '50mb', extended: true }));
app.use(
  fileUpload({
    limits: {
      fileSize: 25 * 1024 * 1024,
    },
    safeFileNames: true,
    preserveExtension: true,
    abortOnLimit: true,
    responseOnLimit: "Max file size is 25mb",
  })
);

// logger
app.use(morgan('combined'));

// routes
app.use('/api/v1', apiRoutes);

// web socket for payment listener
startSocketServer(process.env.SOCKET_SERVER_PORT);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on localhost:${process.env.PORT}`);
});