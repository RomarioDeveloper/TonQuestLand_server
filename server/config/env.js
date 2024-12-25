// server/config/env.js
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

module.exports = {
  BOT_TOKEN: process.env.BOT_TOKEN,
  PORT: process.env.PORT || 3000,
  DB_URI: process.env.DB_URI,
  JWT_SECRET: process.env.JWT_SECRET
};

// Откдадка
console.log('Environment variables loaded:');
console.log('DB_URI:', process.env.DB_URI);
console.log('PORT:', process.env.PORT);
console.log('BOT_TOKEN:', process.env.BOT_TOKEN);