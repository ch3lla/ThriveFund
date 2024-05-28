require('dotenv').config();
const express = require('express');
const { json, urlencoded } = require('express');
const cors = require('cors');
const db = require('./config/db');

const apiRoutes = require('./routes/index');

const app = express();
// connecting database
db();

// middlewares
app.use(cors());
app.options(`${process.env.FRONTEND_URL}`, cors()); // * will be changed to specified url later on
app.use(json({ limit: '50mb' }));
app.use(urlencoded({ limit: '50mb', extended: true }));

// routes
app.use('/api/v1', apiRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on localhost:${process.env.PORT}`);
});