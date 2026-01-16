// Простейший Telegram бот для ГДЗ
const TelegramBot = require('node-telegram-bot-api');
const express = require('express');

// Настройки
const token = process.env.BOT_TOKEN || '8456034289:AAFocvpSevSlavQh_FJnbyJ-WdpVa4Zw9Hw';
const PORT = process.env.PORT || 3000;

// Проверка токена
if (!token) {
  console.error('❌ ОШИБКА: Нет токена бота!');
  console.log('👉 Добавьте BOT_TOKEN в переменные окружения Render');
  process.exit(1);
}

// Создаем бота
console.log('🤖 Создаем бота...');
const bot = new TelegramBot(token, { polling: true });

// Создаем веб-сервер для Render
const app = express();

// Главная страница
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>✅ ГДЗ Бот Работает</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
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
            h1 { font-size: 2em; }
            .btn {
                display: inline-block;
                background: #0088cc;
                color: white;
                padding: 12px 24px;
                text-decoration: none;
                border-radius: 8px;
                margin: 10px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>✅ ГДЗ Бот Работает!</h1>
            <p>Бот запущен на Render.com</p>
            <p>Перейдите в Telegram для использования</p>
            <a href="https://t.me/gdz_navigator_bot" class="btn" target="_blank">Открыть бота в Telegram</a>
        </div>
    </body>
    </html>
  `);
});

// Health check
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`🌐 Веб-сервер запущен на порту ${PORT}`);
});

// =================== КОМАНДЫ БОТА ===================

// /start - главная команда
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const userName = msg.from.first_name || 'друг';
  
  const text = `👋 Привет, ${userName}!\n\nЯ - бот ГДЗ Навигатор 🤖\nПомогу найти готовые домашние задания.\n\n*Команды:*\n/start - это меню\n/7class - 7 класс\n/8class - 8 класс\n/9class - 9 класс\n/webapp - Web приложение\n\n📱 *Web App:* https://razetka2010.github.io/gdz-navigator/`;
  
  const options = {
    parse_mode: 'Markdown',
    reply_markup: {
      keyboard: [
        ['7 класс', '8 класс', '9 класс'],
        ['📱 Web App', 'ℹ️ Помощь']
      ],
      resize_keyboard: true,
      one_time_keyboard: false
    }
  };
  
  bot.sendMessage(chatId, text, options);
});

// 7 класс
bot.onText(/\/7class|7 класс/, (msg) => {
  const chatId = msg.chat.id;
  
  const text = `📚 *7 класс*\n\n*Доступные предметы:*\n\n1. 📐 Геометрия (Атанасян)\nhttps://otvetkin.info/reshebniki/7-klass/geometriya/atanasyan\n\n2. 📊 Математика (Высоцкий)\nhttps://gdz.ru/class-7/matematika/vysockij-yashenko-bazovij-uroven\n\n3. ⚡ Физика (Лукашик)\nhttps://pomogalka.me/7-klass/fizika/lukashik-ivanova`;
  
  bot.sendMessage(chatId, text, { parse_mode: 'Markdown' });
});

// 8 класс
bot.onText(/\/8class|8 класс/, (msg) => {
  const chatId = msg.chat.id;
  
  const text = `📚 *8 класс*\n\n*Доступные предметы:*\n\n1. 🔢 Алгебра (Макарычев)\nhttps://otvetkin.info/reshebniki/8-klass/algebra/makarychev\n\n2. 📝 Русский язык (Бархударов)\nhttps://otvetkin.info/reshebniki/8-klass/russkiy-yazyk/barhudarov-fgos\n\n3. 🇬🇧 Английский (Spotlight 8)\nhttps://gdz.ru/class-8/english/reshebnik-spotlight-8-angliyskiy-v-fokuse-vaulina-yu-e\n\n4. 🏛️ История (Арсентьев)\nhttps://pomogalka.me/8-klass/istoriya/arsentev`;
  
  bot.sendMessage(chatId, text, { parse_mode: 'Markdown' });
});

// 9 класс
bot.onText(/\/9class|9 класс/, (msg) => {
  const chatId = msg.chat.id;
  
  const text = `📚 *9 класс*\n\n*Доступные предметы:*\n\n1. 🇬🇧 Английский (Spotlight 9)\nhttps://gdz.ru/class-9/english/reshebnik-spotlight-9-vaulina-yu-e\n\n2. 🧪 Химия (Габриелян)\nhttps://gdz.ru/class-9/himiya/gabrielyan-sladkov\n\n3. ⚡ Физика (Перышкин)\nhttps://gdz.ru/class-9/fizika/peryshkin-gutnik\n\n4. 🔢 Алгебра (Макарычев)\nhttps://gdz.ru/class-9/algebra/makarichev-14`;
  
  bot.sendMessage(chatId, text, { parse_mode: 'Markdown' });
});

// Web App
bot.onText(/\/webapp|📱 web app/i, (msg) => {
  const chatId = msg.chat.id;
  
  const text = `🌐 *Web App ГДЗ Навигатора*\n\n*Ссылка:* https://razetka2010.github.io/gdz-navigator/\n\n*Открыть в:*`;
  
  const options = {
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: [
        [{ text: "📱 Открыть в Telegram", web_app: { url: "https://razetka2010.github.io/gdz-navigator/" } }],
        [{ text: "🌐 Открыть в браузере", url: "https://razetka2010.github.io/gdz-navigator/" }],
        [{ text: "◀️ Назад", callback_data: "back" }]
      ]
    }
  };
  
  bot.sendMessage(chatId, text, options);
});

// Помощь
bot.onText(/\/help|помощь|ℹ️ помощь/i, (msg) => {
  const chatId = msg.chat.id;
  
  const text = `📖 *Помощь по боту*\n\n*Команды:*\n/start - Главное меню\n/7class - 7 класс\n/8class - 8 класс\n/9class - 9 класс\n/webapp - Web приложение\n\n*Web App (рекомендуем):*\nhttps://razetka2010.github.io/gdz-navigator/\n\nТам больше предметов и удобный поиск!`;
  
  bot.sendMessage(chatId, text, { parse_mode: 'Markdown' });
});

// Обработка текстовых сообщений
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text?.toLowerCase() || '';
  
  // Игнорируем команды
  if (text.startsWith('/')) return;
  
  if (text.includes('привет') || text.includes('hello') || text.includes('start')) {
    bot.sendMessage(chatId, 'Привет! Напиши /start для меню');
  }
});

// Обработка ошибок
bot.on('polling_error', (error) => {
  console.error('❌ Ошибка polling:', error.code, error.message);
});

bot.on('error', (error) => {
  console.error('❌ Ошибка бота:', error.message);
});

// =================== ЗАПУСК ===================

console.log('='.repeat(50));
console.log('🚀 БОТ ГДЗ НАВИГАТОР');
console.log('='.repeat(50));
console.log(`✅ Токен: ${token.substring(0, 10)}...`);
console.log(`🌐 Web App: https://razetka2010.github.io/gdz-navigator/`);
console.log(`🔗 Health: http://localhost:${PORT}/health`);
console.log('='.repeat(50));
console.log('🤖 Ожидание сообщений...');
console.log('='.repeat(50));

// Проверка работы
setTimeout(() => {
  console.log('✅ Бот готов к работе!');
  console.log('👉 Отправьте /start в Telegram');
}, 1000);
