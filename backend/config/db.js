




const mongoose = require('mongoose');
const { secret } = require('./secret');

mongoose.set('strictQuery', false);

const connectDB = async () => {
  try {
    await mongoose.connect(secret.db_url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('mongodb connection success!');
  } catch (err) {
    console.error('mongodb connection failed!', err.message);
  }
};

module.exports = connectDB;
