const User = require('../models/User');
const { verifyTelegramInitData } = require('../utils/telegramAuth');

exports.authUser = async (req, res) => {
  try {
    const { initData } = req.body; // или req.query, смторя как данные отправим
    if (!initData) {
      return res.status(400).json({ message: 'No initData provided' });
    }

    // Проверяем корректность initData
    const data = verifyTelegramInitData(initData);
    if (!data) {
      return res.status(401).json({ message: 'Invalid initData signature' });
    }

    // Если всё ок, достаём telegram_user_id, username, first_name и т.д.
    const telegramId = data.user?.id || data.telegram_user_id; 
    const username = data.user?.username || data.username;
    const firstName = data.user?.first_name || data.first_name;
    const lastName = data.user?.last_name || data.last_name;

    // Пытаемся найти пользователя в БД
    let user = await User.findOne({ telegramId });

    // Если нету - создаём
    if (!user) {
      user = await User.create({
        telegramId,
        username,
        first_name: firstName,
        last_name: lastName,
      });
    }

    // Возвращаем данные
    res.status(200).json({
      message: 'User authenticated',
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};