const express = require('express');
const cors = require('cors');
const telegramAuth = require('./utils/telegramAuth');
const authRoutes = require('./routes/auth');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// роуты
app.use('/api/auth', authRoutes);

// роут для теста
app.get('/', (req, res) => {
  res.json({ 
    message: 'TonQuestLand API is running',
    endpoints: {
      auth: '/api/auth'
    }
  });
});

// ловим ошибки
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: err.message 
  });
});

module.exports = app;