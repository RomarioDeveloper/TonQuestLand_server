const express = require('express');
const router = express.Router();
const auth = require('../middleWare/authMiddleware');
const { authUser } = require('../controllers/userController');

// Тестовый маршрут
router.get('/test', (req, res) => {
  res.json({ message: 'Auth route is working' });
});

// Маршрут аутентификации через Telegram
router.post('/telegram', authUser);

// Защищенный маршрут для получения профиля
router.get('/me', auth, async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Маршрут для выхода
router.post('/logout', auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(t => t.token !== req.token);
    await req.user.save();
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;