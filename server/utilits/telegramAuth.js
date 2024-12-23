const crypto = require('crypto');
const querystring = require('querystring');
const { BOT_TOKEN } = require('../config/env');

/**
 * Проверка, что initData пришло не подделанное.
 */
function verifyTelegramInitData(initData) {
  const parsedData = querystring.parse(initData);

  const { hash } = parsedData;
  delete parsedData.hash;

  // сортирую ключи по алфавиту
  const sortedKeys = Object.keys(parsedData).sort((a, b) => a.localeCompare(b));

  // Формируем строку в определенном виде
  const dataCheckString = sortedKeys
    .map((key) => `${key}=${parsedData[key]}`)
    .join('\n');

  // делаем ключ
  const secretKey = crypto
    .createHash('sha256')
    .update(BOT_TOKEN)
    .digest();

  // Вычисляем хеш
  const hmac = crypto
    .createHmac('sha256', secretKey)
    .update(dataCheckString)
    .digest('hex');

  // Сравниваем полученный hmac с hash, который присылает тг
  if (hmac === hash) {
    return parsedData;
  } else {
    return null;
  }
}

module.exports = {
  verifyTelegramInitData,
};