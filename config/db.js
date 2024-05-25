const mongoose = require('mongoose');

const db = () => {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log('Connected to MongDB');
    })
    .catch((error) => {
      console.error('Error connection to MongoDB: ', error);
    });
};

module.exports = db;