const crypto = require('crypto');
const querystring = require('querystring');
const { BOT_TOKEN } = require('../config/env');

/**
 * Проверка валидности данных от Telegram
 * @param {string} initData - Данные инициализации от Telegram
 * @returns {Object|null} - Объект с данными пользователя или null при ошибке
 */
function verifyTelegramInitData(initData) {
  try {
    // Проверка наличия initData
    if (!initData) {
      console.error('No initData provided');
      return null;
    }

    const parsedData = querystring.parse(initData);

    // Проверка наличия hash
    if (!parsedData.hash) {
      console.error('No hash in initData');
      return null;
    }

    const { hash, ...dataWithoutHash } = parsedData;

    // Сортировка ключей
    const sortedKeys = Object.keys(dataWithoutHash).sort();
    
    // Формирование строки для проверки
    const dataCheckString = sortedKeys
      .map(key => `${key}=${dataWithoutHash[key]}`)
      .join('\n');

    // Создание секретного ключа
    const secretKey = crypto
      .createHash('sha256')
      .update(BOT_TOKEN)
      .digest();

    // Вычисление HMAC
    const hmac = crypto
      .createHmac('sha256', secretKey)
      .update(dataCheckString)
      .digest('hex');

    // Проверка подписи
    if (hmac !== hash) {
      console.error('Invalid telegram hash');
      return null;
    }

    // Парсинг user данных если они есть
    if (parsedData.user) {
      try {
        parsedData.user = JSON.parse(parsedData.user);
      } catch (e) {
        console.error('Failed to parse user data:', e);
      }
    }

    return parsedData;
  } catch (error) {
    console.error('Telegram auth verification error:', error);
    return null;
  }
}

/**
 * Проверка актуальности auth_date
 * @param {number} authDate - Timestamp авторизации
 * @returns {boolean} - Валидность времени авторизации
 */
function isAuthDateValid(authDate) {
  const MAX_AUTH_AGE = 86400; // 24 часа в секундах
  const currentTime = Math.floor(Date.now() / 1000);
  return (currentTime - authDate) < MAX_AUTH_AGE;
}

/**
 * Извлечение данных пользователя из проверенных данных
 * @param {Object} verifiedData - Проверенные данные от Telegram
 * @returns {Object} - Объект с данными пользователя
 */
function extractUserData(verifiedData) {
  const userData = verifiedData.user || {};
  
  return {
    telegramId: userData.id?.toString(),
    username: userData.username || null,
    firstName: userData.first_name || null,
    lastName: userData.last_name || null,
    languageCode: userData.language_code || null,
    photoUrl: userData.photo_url || null,
    authDate: verifiedData.auth_date ? parseInt(verifiedData.auth_date) : null
  };
}

module.exports = {
  verifyTelegramInitData,
  isAuthDateValid,
  extractUserData
};