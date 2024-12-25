const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    telegramId: {
      type: String,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      required: false,
    },
    first_name: {
      type: String,
      required: false,
    },
    last_name: {
      type: String,
      required: false,
    },
    profilePhoto: {
      type: String,
      required: false, // URL аватара пользователя, если нужно
    },
    questsCompleted: {
      type: [String], // массив строк для хранения ID выполненных квестов
      default: [],
    },
    nftWalletAddress: {
      type: String,
      required: false, 
    },
    // Добавляем массив токенов с TTL (1 час)
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
          expires: '1h', // токен истекает через час
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('User', userSchema);