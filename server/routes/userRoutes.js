const express = require('express');
const UserController = require('../controllers/userController');

const router = express.Router();

router.post('/telegram-auth', UserController.telegramAuth);


router.get('/profile', UserController.authenticateToken, (req, res) => {
  res.json(req.user);
});

module.exports = router;