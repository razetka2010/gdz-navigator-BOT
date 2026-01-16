const TelegramBot = require('node-telegram-bot-api');
const express = require('express');

// Конфигурация
const token = process.env.BOT_TOKEN || '8456034289:AAFocvpSevSlavQh_FJnbyJ-WdpVa4Zw9Hw';
const WEB_APP_URL = process.env.WEB_APP_URL || 'https://razetka2010.github.io/gdz-navigator/';
const PORT = process.env.PORT || 3000;

// Проверка токена
if (!token) {
  console.error('❌ ОШИБКА: Не указан токен бота!');
  console.log('Добавьте в переменные окружения: BOT_TOKEN=ваш_токен');
  process.exit(1);
}

// Данные предметов
const subjects = {
  "7": [
    { name: "Геометрия Атанасян", url: "https://otvetkin.info/reshebniki/7-klass/geometriya/atanasyan", icon: "📐" },
    { name: "Математика Высоцкий", url: "https://gdz.ru/class-7/matematika/vysockij-yashenko-bazovij-uroven", icon: "📊" },
    { name: "Физика Лукашик", url: "https://pomogalka.me/7-klass/fizika/lukashik-ivanova", icon: "⚡" }
  ],
  "8": [
    { name: "Алгебра Макарычев", url: "https://otvetkin.info/reshebniki/8-klass/algebra/makarychev", icon: "🔢" },
    { name: "Русский Бархударов", url: "https://otvetkin.info/reshebniki/8-klass/russkiy-yazyk/barhudarov-fgos", icon: "📝" },
    { name: "Английский Spotlight", url: "https://gdz.ru/class-8/english/reshebnik-spotlight-8-angliyskiy-v-fokuse-vaulina-yu-e", icon: "🇬🇧" },
    { name: "История Арсентьев", url: "https://pomogalka.me/8-klass/istoriya/arsentev", icon: "🏛️" }
  ],
  "9": [
    { name: "Английский Spotlight 9", url: "https://gdz.ru/class-9/english/reshebnik-spotlight-9-vaulina-yu-e", icon: "🇬🇧" },
    { name: "Химия Габриелян", url: "https://gdz.ru/class-9/himiya/gabrielyan-sladkov", icon: "🧪" },
    { name: "Физика Перышкин", url: "https://gdz.ru/class-9/fizika/peryshkin-gutnik", icon: "⚡" },
    { name: "Алгебра Макарычев", url: "https://gdz.ru/class-9/algebra/makarichev-14", icon: "🔢" }
  ]
};

// Инициализация бота
const bot = new TelegramBot(token, { polling: true });

// Хранилище избранного (в памяти)
const favorites = {};

// Веб-сервер для Render
const app = express();

// Главная страница
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>🤖 ГДЗ Бот</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                text-align: center;
                padding: 50px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
            }
            .container {
                background: rgba(255,255,255,0.1);
                padding: 30px;
                border-radius: 20px;
                max-width: 600px;
                margin: 0 auto;
            }
            h1 { font-size: 2.5em; }
            .status { color: #4CAF50; font-size: 1.5em; }
            .btn {
                display: inline-block;
                background: #0088cc;
                color: white;
                padding: 15px 30px;
                text-decoration: none;
                border-radius: 10px;
                margin-top: 20px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>📚 ГДЗ Навигатор Бот</h1>
            <div class="status">✅ БОТ АКТИВЕН</div>
            <p>Бот работает в Telegram</p>
            <a href="https://t.me/gdz_navigator_bot" class="btn" target="_blank">Открыть бота</a>
        </div>
    </body>
    </html>
  `);
});

// Health check
app.get('/health', (req, res) => {
  res.send('OK');
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`🌐 Сервер запущен на порту ${PORT}`);
});

// =================== КОМАНДЫ БОТА ===================

// /start - Главное меню
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const text = `👋 Привет, ${msg.from.first_name}!

Я помогу найти ГДЗ для 7-9 классов.

📱 *Web App с полным функционалом:*
${WEB_APP_URL}

📚 Выберите действие:`;

  const options = {
    reply_markup: {
      inline_keyboard: [
        [
          { text: "7 класс", callback_data: "class_7" },
          { text: "8 класс", callback_data: "class_8" },
          { text: "9 класс", callback_data: "class_9" }
        ],
        [
          { text: "📱 Открыть Web App", web_app: { url: WEB_APP_URL } },
          { text: "⭐ Избранное", callback_data: "favorites" }
        ],
        [
          { text: "ℹ️ Помощь", callback_data: "help" },
          { text: "📊 Статус", callback_data: "status" }
        ]
      ]
    },
    parse_mode: 'Markdown'
  };

  bot.sendMessage(chatId, text, options);
});

// /help
bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;
  const text = `📖 *Помощь по боту*

*Основные команды:*
/start - Главное меню
/classes - Выбрать класс
/webapp - Открыть Web App
/help - Эта справка

*Как использовать:*
1. Выберите класс
2. Выберите предмет
3. Получите ссылку на ГДЗ

*Web App (рекомендуем):*
${WEB_APP_URL}
- Полный поиск
- Все предметы
- Удобный интерфейс`;

  const options = {
    reply_markup: {
      inline_keyboard: [
        [{ text: "📱 Открыть Web App", web_app: { url: WEB_APP_URL } }],
        [{ text: "◀️ Назад", callback_data: "back" }]
      ]
    },
    parse_mode: 'Markdown'
  };

  bot.sendMessage(chatId, text, options);
});

// /classes
bot.onText(/\/classes/, (msg) => {
  const chatId = msg.chat.id;
  
  const options = {
    reply_markup: {
      inline_keyboard: [
        [
          { text: "7 класс", callback_data: "class_7" },
          { text: "8 класс", callback_data: "class_8" },
          { text: "9 класс", callback_data: "class_9" }
        ],
        [
          { text: "📱 Web App", web_app: { url: WEB_APP_URL } },
          { text: "◀️ Назад", callback_data: "back" }
        ]
      ]
    }
  };

  bot.sendMessage(chatId, "📚 Выберите класс:", options);
});

// /webapp
bot.onText(/\/webapp/, (msg) => {
  const chatId = msg.chat.id;
  
  const options = {
    reply_markup: {
      inline_keyboard: [
        [{ text: "🎯 Открыть Web App в Telegram", web_app: { url: WEB_APP_URL } }],
        [{ text: "🌐 Открыть в браузере", url: WEB_APP_URL }],
        [{ text: "◀️ Назад", callback_data: "back" }]
      ]
    }
  };

  bot.sendMessage(chatId, `🌐 *Web App ГДЗ Навигатора*\n\n${WEB_APP_URL}`, { 
    ...options, 
    parse_mode: 'Markdown' 
  });
});

// /status
bot.onText(/\/status/, (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const favCount = favorites[userId] ? favorites[userId].length : 0;
  
  const text = `📊 *Статус бота*

✅ Бот активен
📚 Классы: 7-9
⭐ Избранное: ${favCount} предметов
🌐 Web App: ${WEB_APP_URL}
🕐 Время: ${new Date().toLocaleTimeString()}

*Всё работает отлично!* 🚀`;

  bot.sendMessage(chatId, text, { parse_mode: 'Markdown' });
});

// =================== ОБРАБОТКА КНОПОК ===================

bot.on('callback_query', (callbackQuery) => {
  const msg = callbackQuery.message;
  const chatId = msg.chat.id;
  const data = callbackQuery.data;
  const userId = callbackQuery.from.id;

  // Всегда отвечаем на callback
  bot.answerCallbackQuery(callbackQuery.id);

  // Обработка разных callback данных
  switch(data) {
    case 'back':
      bot.sendMessage(chatId, "Возвращаемся в главное меню...");
      bot.sendMessage(chatId, "Выберите действие:", {
        reply_markup: {
          inline_keyboard: [
            [
              { text: "7 класс", callback_data: "class_7" },
              { text: "8 класс", callback_data: "class_8" },
              { text: "9 класс", callback_data: "class_9" }
            ],
            [
              { text: "📱 Web App", web_app: { url: WEB_APP_URL } },
              { text: "⭐ Избранное", callback_data: "favorites" }
            ]
          ]
        }
      });
      break;

    case 'help':
      bot.sendMessage(chatId, `📖 *Помощь*\n\nИспользуйте Web App для полного функционала:\n${WEB_APP_URL}`, {
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [{ text: "📱 Открыть Web App", web_app: { url: WEB_APP_URL } }],
            [{ text: "◀️ Назад", callback_data: "back" }]
          ]
        }
      });
      break;

    case 'status':
      const favCount = favorites[userId] ? favorites[userId].length : 0;
      bot.sendMessage(chatId, `✅ Бот работает\n⭐ Избранное: ${favCount}\n🌐 ${WEB_APP_URL}`, {
        reply_markup: {
          inline_keyboard: [
            [{ text: "🔄 Обновить", callback_data: "status" }],
            [{ text: "◀️ Назад", callback_data: "back" }]
          ]
        }
      });
      break;

    case 'favorites':
      showFavorites(chatId, userId);
      break;

    case 'clear_favorites':
      favorites[userId] = [];
      bot.sendMessage(chatId, "✅ Избранное очищено!");
      break;

    default:
      if (data.startsWith('class_')) {
        const classNum = data.split('_')[1];
        showClassSubjects(chatId, classNum, userId);
      } else if (data.startsWith('subject_')) {
        const parts = data.split('_');
        const classNum = parts[1];
        const index = parseInt(parts[2]);
        showSubjectInfo(chatId, classNum, index, userId);
      } else if (data.startsWith('add_fav_')) {
        const parts = data.split('_');
        const classNum = parts[2];
        const index = parseInt(parts[3]);
        addToFavorites(userId, classNum, index);
        bot.answerCallbackQuery(callbackQuery.id, { text: '✅ Добавлено в избранное!' });
        showSubjectInfo(chatId, classNum, index, userId);
      } else if (data.startsWith('remove_fav_')) {
        const parts = data.split('_');
        const classNum = parts[2];
        const index = parseInt(parts[3]);
        removeFromFavorites(userId, classNum, index);
        bot.answerCallbackQuery(callbackQuery.id, { text: '❌ Удалено из избранного!' });
        showSubjectInfo(chatId, classNum, index, userId);
      }
  }
});

// =================== ФУНКЦИИ ===================

// Показать предметы класса
function showClassSubjects(chatId, classNum, userId) {
  const classSubjects = subjects[classNum] || [];
  
  if (classSubjects.length === 0) {
    bot.sendMessage(chatId, `Для ${classNum} класса пока нет предметов.`);
    return;
  }

  const buttons = classSubjects.map((subject, index) => {
    const isFavorite = favorites[userId] && 
      favorites[userId].some(fav => fav.url === subject.url);
    
    const text = isFavorite ? `⭐ ${subject.icon} ${subject.name}` : `${subject.icon} ${subject.name}`;
    return [{ text: text, callback_data: `subject_${classNum}_${index}` }];
  });

  buttons.push([
    { text: "📱 Web App", web_app: { url: WEB_APP_URL } },
    { text: "⭐ Избранное", callback_data: "favorites" }
  ]);
  buttons.push([{ text: "◀️ Назад", callback_data: "back" }]);

  bot.sendMessage(chatId, `📖 *${classNum} класс*\nВыберите предмет:`, {
    parse_mode: 'Markdown',
    reply_markup: { inline_keyboard: buttons }
  });
}

// Показать информацию о предмете
function showSubjectInfo(chatId, classNum, index, userId) {
  const subject = subjects[classNum][index];
  const isFavorite = favorites[userId] && 
    favorites[userId].some(fav => fav.url === subject.url);

  const text = `${subject.icon} *${subject.name}*\n\n*Ссылка:* ${subject.url}\n\nДля поиска других предметов используйте Web App!`;

  const favoriteBtn = isFavorite 
    ? { text: "❌ Удалить из избранного", callback_data: `remove_fav_${classNum}_${index}` }
    : { text: "⭐ Добавить в избранное", callback_data: `add_fav_${classNum}_${index}` };

  const options = {
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: [
        [favoriteBtn],
        [{ text: "🔗 Открыть ссылку", url: subject.url }],
        [{ text: "📱 Открыть Web App", web_app: { url: WEB_APP_URL } }],
        [
          { text: "◀️ Назад к предметам", callback_data: `class_${classNum}` },
          { text: "🏠 Главная", callback_data: "back" }
        ]
      ]
    }
  };

  bot.sendMessage(chatId, text, options);
}

// Добавить в избранное
function addToFavorites(userId, classNum, index) {
  if (!favorites[userId]) {
    favorites[userId] = [];
  }
  
  const subject = subjects[classNum][index];
  const exists = favorites[userId].some(fav => fav.url === subject.url);
  
  if (!exists) {
    favorites[userId].push({
      ...subject,
      class: classNum
    });
  }
}

// Удалить из избранного
function removeFromFavorites(userId, classNum, index) {
  if (!favorites[userId]) return;
  
  const subject = subjects[classNum][index];
  favorites[userId] = favorites[userId].filter(fav => fav.url !== subject.url);
}

// Показать избранное
function showFavorites(chatId, userId) {
  const userFavorites = favorites[userId] || [];
  
  if (userFavorites.length === 0) {
    bot.sendMessage(chatId, "⭐ У вас пока нет избранных предметов.\n\nДобавляйте предметы через меню!", {
      reply_markup: {
        inline_keyboard: [
          [{ text: "📱 Открыть Web App", web_app: { url: WEB_APP_URL } }],
          [{ text: "◀️ Назад", callback_data: "back" }]
        ]
      }
    });
    return;
  }

  let text = "⭐ *Ваше избранное:*\n\n";
  const buttons = [];

  userFavorites.forEach((subject, i) => {
    if (i < 8) { // Ограничиваем количество
      text += `${subject.icon} ${subject.name}\n`;
      
      // Находим индекс предмета
      const classSubjects = subjects[subject.class] || [];
      const index = classSubjects.findIndex(s => s.url === subject.url);
      
      if (index !== -1) {
        buttons.push([{ 
          text: `${subject.icon} ${subject.name}`,
          callback_data: `subject_${subject.class}_${index}`
        }]);
      }
    }
  });

  buttons.push([{ text: "🗑️ Очистить избранное", callback_data: "clear_favorites" }]);
  buttons.push([{ text: "◀️ Назад", callback_data: "back" }]);

  bot.sendMessage(chatId, text, {
    parse_mode: 'Markdown',
    reply_markup: { inline_keyboard: buttons }
  });
}

// =================== ОБРАБОТКА ТЕКСТА ===================

bot.on('message', (msg) => {
  // Игнорируем команды (они уже обрабатываются)
  if (msg.text && msg.text.startsWith('/')) {
    return;
  }

  const chatId = msg.chat.id;
  const text = msg.text?.toLowerCase() || '';

  if (text.includes('привет') || text.includes('start') || text.includes('начать')) {
    bot.sendMessage(chatId, "Привет! Используй /start для меню");
  } else if (text.includes('помощь') || text.includes('help')) {
    bot.sendMessage(chatId, "Используй /help для помощи");
  } else if (text.includes('класс') || text.includes('гдз')) {
    bot.sendMessage(chatId, "Используй /classes для выбора класса");
  } else {
    bot.sendMessage(chatId, "Не понял. Используй /start для меню", {
      reply_markup: {
        inline_keyboard: [
          [{ text: "📱 Открыть Web App", web_app: { url: WEB_APP_URL } }],
          [{ text: "📚 Выбрать класс", callback_data: "class_select" }]
        ]
      }
    });
  }
});

// =================== ЗАПУСК ===================

console.log('='.repeat(50));
console.log('🤖 ГДЗ Бот запущен!');
console.log(`👤 Бот: @gdz_navigator_bot`);
console.log(`🌐 Web App: ${WEB_APP_URL}`);
console.log('✅ Все системы работают');
console.log('='.repeat(50));

// Обработка ошибок
bot.on('polling_error', (error) => {
  console.error('Ошибка polling:', error);
});

bot.on('error', (error) => {
  console.error('Ошибка бота:', error);
});
