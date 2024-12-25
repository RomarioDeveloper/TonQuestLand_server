const { 
  verifyTelegramInitData, 
  isAuthDateValid, 
  extractUserData 
} = require('../utils/telegramAuth');

exports.authUser = async (req, res) => {
  try {
    const { initData } = req.body;
    
    // Проверяем данные
    const verifiedData = verifyTelegramInitData(initData);
    if (!verifiedData) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid authentication data' 
      });
    }

    // Проверяем актуальность auth_date
    if (!isAuthDateValid(verifiedData.auth_date)) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication data expired' 
      });
    }

    // Извлекаем данные пользователя
    const userData = extractUserData(verifiedData);

    // Ищем или создаем пользователя
    let user = await User.findOne({ telegramId: userData.telegramId });
    
    if (!user) {
      user = await User.create(userData);
    } else {
      // Обновляем существующего пользователя
      Object.assign(user, userData);
      await user.save();
    }

    // Генерируем токен
    const token = jwt.sign(
      { telegramId: user.telegramId },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Сохраняем токен
    user.tokens = user.tokens || [];
    user.tokens.push({ token });
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Authentication successful',
      user: {
        id: user._id,
        telegramId: user.telegramId,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        photoUrl: user.photoUrl
      },
      token
    });

  } catch (error) {
    console.error('Auth error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message 
    });
  }
};