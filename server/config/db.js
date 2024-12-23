const mongoose = require('mongoose');
const { DB_URI } = require('./env'); // DB_URI переменная лежит в файлике server/config/.env

async function connectDB() {
  try {
    await mongoose.connect(DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('MongoDB connected.');

  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
}

module.exports = connectDB;