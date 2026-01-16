const { Telegraf, Markup } = require('telegraf');
const express = require('express');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Данные предметов
const SUBJECTS_DATA = {
  "7": [
    { name: "Геометрия", author: "Атанасян", url: "https://otvetkin.info/reshebniki/7-klass/geometriya/atanasyan", icon: "📐" },
    { name: "Вероятность и статистика", author: "Высоцкий, Ященко", url: "https://gdz.ru/class-7/matematika/vysockij-yashenko-bazovij-uroven", icon: "📊" },
    { name: "Физика", author: "Сборник Лукашик", url: "https://pomogalka.me/7-klass/fizika/lukashik-ivanova", icon: "⚡" }
  ],
  "8": [
    { name: "Алгебра", author: "Макарычев", url: "https://otvetkin.info/reshebniki/8-klass/algebra/makarychev", icon: "🔢" },
    { name: "Русский язык", author: "Бархударов", url: "https://otvetkin.info/reshebniki/8-klass/russkiy-yazyk/barhudarov-fgos", icon: "📝" },
    { name: "Английский", author: "Spotlight 8", url: "https://gdz.ru/class-8/english/reshebnik-spotlight-8-angliyskiy-v-fokuse-vaulina-yu-e", icon: "🇬🇧" },
    { name: "История России", author: "Арсентьев", url: "https://pomogalka.me/8-klass/istoriya/arsentev", icon: "🏛️" },
    { name: "Химия", author: "Габриелян", url: "https://gdz.top/8-klass/himiya/gabrielyan-ostroumov-uchebnik", icon: "🧪" },
    { name: "Физика", author: "Перышкин", url: "https://gdz.fm/fizika/8-klass/pyoryshkin", icon: "⚡" },
    { name: "Обществознание", author: "Боголюбов", url: "https://gdz.ru/class-8/obshhestvoznanie/reshebnik-bogolyubov-l-n", icon: "👥" },
    { name: "Информатика", author: "Босова", url: "https://murnik.ru/gdz-po-informatike-8-klass-bosova", icon: "💻" }
  ],
  "9": [
    { name: "Английский", author: "Spotlight 9", url: "https://gdz.ru/class-9/english/reshebnik-spotlight-9-vaulina-yu-e", icon: "🇬🇧" },
    { name: "Химия", author: "Габриелян, Сладков", url: "https://gdz.ru/class-9/himiya/gabrielyan-sladkov", icon: "🧪" },
    { name: "География", author: "Алексеев", url: "https://gdz.ru/class-9/geografiya/alekseev-bolysov", icon: "🗺️" },
    { name: "Физика", author: "Перышкин", url: "https://gdz.ru/class-9/fizika/peryshkin-gutnik", icon: "⚡" },
    { name: "Обществознание", author: "Боголюбов", url: "https://reshak.ru/reshebniki/obshestvo/9/bogolubov/index.html", icon: "👥" },
    { name: "Русский язык", author: "Бархударов", url: "https://gdz.ru/class-9/russkii_yazik/barhudarov-kruchkov-9", icon: "📝" },
    { name: "Литература", author: "Коровина", url: "https://pomogalka.me/9-klass/literatura/korovina", icon: "📚" },
    { name: "Алгебра", author: "Макарычев", url: "https://gdz.ru/class-9/algebra/makarichev-14", icon: "🔢" }
  ]
};

// Web App URL
const WEB_APP_URL = process.env.WEB_APP_URL || "https://razetka2010.github.io/gdz-navigator/";

// Хранилище избранного (в памяти)
const userFavorites = {};

// Инициализация бота
const bot = new Telegraf(process.env.BOT_TOKEN);

// Express веб-сервер
app.use(express.json());

// Статусная страница
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>🤖 ГДЗ Навигатор Бот</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
            body {
                font-family: Arial, sans-serif;
                text-align: center;
                padding: 50px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                min-height: 100vh;
                margin: 0;
            }
            .container {
                background: rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(10px);
                padding: 30px;
                border-radius: 20px;
                max-width: 600px;
                margin: 0 auto;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
            }
            h1 {
                font-size: 2.5em;
                margin-bottom: 20px;
            }
            .status {
                font-size: 1.5em;
                color: #4CAF50;
                font-weight: bold;
                margin: 20px 0;
            }
            .telegram-btn {
                display: inline-block;
                background: #0088cc;
                color: white;
                padding: 15px 30px;
                text-decoration: none;
                border-radius: 10px;
                font-size: 1.2em;
                margin-top: 20px;
                transition: all 0.3s;
            }
            .telegram-btn:hover {
                background: #006699;
                transform: translateY(-2px);
            }
            .stats {
                margin-top: 20px;
                font-size: 1.1em;
                background: rgba(255, 255, 255, 0.1);
                padding: 15px;
                border-radius: 10px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>📚 ГДЗ Навигатор Бот</h1>
            <div class="status">✅ БОТ ЗАПУЩЕН НА RENDER.COM</div>
            <p>Telegram бот работает в фоновом режиме</p>
            <p>Для использования перейдите в Telegram</p>
            <div class="stats">
                <p>🌐 Web App: ${WEB_APP_URL}</p>
                <p>🤖 Бот: @gdz_navigator_bot</p>
                <p>🚀 Статус: Активен</p>
            </div>
            <a href="https://t.me/gdz_navigator_bot" class="telegram-btn" target="_blank">
                🔗 Перейти к боту
            </a>
        </div>
    </body>
    </html>
  `);
});

// Health check для Render
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Команда /start
bot.start(async (ctx) => {
  const welcomeText = `
📚 *Привет, ${ctx.from.first_name}!* 🎉

Я - *ГДЗ Навигатор Бот* 🤖
Помогу найти готовые домашние задания для 7-9 классов.

*Для большего функционала используйте наш Web App:*
• Удобный интерфейс
• Поиск по всем предметам
• Сохранение избранного
• Смена классов в один клик

*Доступные команды:*
/start - Главное меню
/classes - Выбрать класс
/favorites - Избранное
/webapp - Открыть Web App
/help - Помощь
/status - Статус бота
  `;

  const keyboard = Markup.inlineKeyboard([
    [
      Markup.button.callback('7 класс', 'class_7'),
      Markup.button.callback('8 класс', 'class_8'),
      Markup.button.callback('9 класс', 'class_9')
    ],
    [
      Markup.button.webApp('📱 Открыть Web App', WEB_APP_URL),
      Markup.button.callback('⭐ Избранное', 'favorites')
    ],
    [
      Markup.button.url('🌐 Web версия', WEB_APP_URL),
      Markup.button.callback('ℹ️ Помощь', 'help')
    ],
    [
      Markup.button.callback('📊 Статус', 'bot_status'),
      Markup.button.callback('🔄 Обновить', 'refresh')
    ]
  ]);

  await ctx.replyWithMarkdown(welcomeText, keyboard);
});

// Команда /webapp
bot.command('webapp', async (ctx) => {
  const text = `
🚀 *Открываем Web App...*

Нажмите кнопку ниже, чтобы открыть полную версию ГДЗ Навигатора!

*В Web App доступно:*
✅ Удобный интерфейс с поиском
✅ Все предметы 7-9 классов
✅ Сохранение избранного
✅ Быстрая навигация
  `;

  const keyboard = Markup.inlineKeyboard([
    [Markup.button.webApp('🎯 Открыть Web App в Telegram', WEB_APP_URL)],
    [
      Markup.button.url('🌐 Открыть в браузере', WEB_APP_URL),
      Markup.button.callback('◀️ Назад', 'back_to_main')
    ]
  ]);

  await ctx.replyWithMarkdown(text, keyboard);
});

// Команда /help
bot.command('help', async (ctx) => {
  const helpText = `
*Помощь по использованию бота* 🆘

*Как пользоваться ботом:*
1. Выберите класс через меню
2. Выберите предмет
3. Получите ссылку на ГДЗ
4. Добавьте в избранное

*Для полного функционала:*
• Поиск по всем предметам
• Удобная навигация
• Сохранение настроек
Используйте *Web App* через кнопку ниже!

*Команды:*
/start - Главное меню
/classes - Выбрать класс
/favorites - Избранное
/webapp - Открыть Web App
/help - Эта справка
/status - Статус бота
  `;

  const keyboard = Markup.inlineKeyboard([
    [Markup.button.webApp('📱 Открыть Web App в Telegram', WEB_APP_URL)],
    [
      Markup.button.url('🌐 Web версия', WEB_APP_URL),
      Markup.button.callback('◀️ Назад', 'back_to_main')
    ]
  ]);

  await ctx.replyWithMarkdown(helpText, keyboard);
});

// Команда /status
bot.command('status', async (ctx) => {
  const userId = ctx.from.id.toString();
  const favoritesCount = userFavorites[userId] ? userFavorites[userId].length : 0;
  
  const statusText = `
📊 *Статус бота*

✅ *Состояние:* Активен
⚡ *Хостинг:* Render.com
📚 *Классы:* 7-9
📱 *Web App:* Доступен
⭐ *Избранное:* ${favoritesCount} предметов
🕐 *Время:* ${new Date().toLocaleTimeString()}

*Ссылки:*
• Web версия: ${WEB_APP_URL}
• Render Dashboard: https://dashboard.render.com
• Health check: ${process.env.RENDER_EXTERNAL_URL || 'http://localhost:' + PORT}/health

*Бот работает стабильно!* 🚀
  `;

  const keyboard = Markup.inlineKeyboard([
    [
      Markup.button.callback('🔄 Обновить статус', 'bot_status'),
      Markup.button.callback('🏠 Главная', 'back_to_main')
    ],
    [
      Markup.button.url('🌐 Render Dashboard', 'https://dashboard.render.com'),
      Markup.button.webApp('📱 Web App', WEB_APP_URL)
    ]
  ]);

  await ctx.replyWithMarkdown(statusText, keyboard);
});

// Команда /classes
bot.command('classes', async (ctx) => {
  const text = "📚 *Выберите класс:*\n\nДля поиска и расширенного функционала откройте *Web App*!";
  
  const keyboard = Markup.inlineKeyboard([
    [
      Markup.button.callback('7 класс', 'class_7'),
      Markup.button.callback('8 класс', 'class_8'),
      Markup.button.callback('9 класс', 'class_9')
    ],
    [
      Markup.button.webApp('📱 Web App', WEB_APP_URL),
      Markup.button.callback('⭐ Избранное', 'favorites')
    ],
    [Markup.button.callback('◀️ Назад', 'back_to_main')]
  ]);

  await ctx.replyWithMarkdown(text, keyboard);
});

// Показать предметы класса
async function showClassSubjects(ctx, classNum) {
  const subjects = SUBJECTS_DATA[classNum] || [];
  const userId = ctx.from.id.toString();
  
  if (subjects.length === 0) {
    await ctx.reply(`📭 Для ${classNum} класса пока нет предметов.`);
    return;
  }
  
  const buttons = subjects.map((subject, index) => {
    let isFavorite = false;
    if (userFavorites[userId]) {
      isFavorite = userFavorites[userId].some(fav => fav.url === subject.url);
    }
    
    const buttonText = isFavorite ? `⭐ ${subject.icon} ${subject.name}` : `${subject.icon} ${subject.name}`;
    return [Markup.button.callback(buttonText, `subject_${classNum}_${index}`)];
  });
  
  buttons.push([
    Markup.button.webApp('📱 Web App', WEB_APP_URL),
    Markup.button.callback('⭐ Избранное', 'favorites')
  ]);
  buttons.push([Markup.button.callback('◀️ Назад', 'classes')]);
  
  const keyboard = Markup.inlineKeyboard(buttons);
  
  const text = `📖 *${classNum} класс*\nВыберите предмет:\n\n*Для поиска используйте Web App!*`;
  
  await ctx.replyWithMarkdown(text, keyboard);
}

// Показать информацию о предмете
async function showSubjectInfo(ctx, classNum, subjectIndex) {
  const subject = SUBJECTS_DATA[classNum][subjectIndex];
  const userId = ctx.from.id.toString();
  
  let isFavorite = false;
  if (userFavorites[userId]) {
    isFavorite = userFavorites[userId].some(fav => fav.url === subject.url);
  }
  
  const text = `
${subject.icon} *${subject.name}*

*Автор:* ${subject.author}
*Класс:* ${classNum}

[Ссылка на ГДЗ](${subject.url})

💡 *Хотите больше функций?*
Откройте *Web App* для поиска и удобной навигации прямо в Telegram!
  `;
  
  const favoriteText = isFavorite ? '❌ Удалить из избранного' : '⭐ Добавить в избранное';
  const favoriteCallback = isFavorite ? `remove_fav_${classNum}_${subjectIndex}` : `add_fav_${classNum}_${subjectIndex}`;
  
  const keyboard = Markup.inlineKeyboard([
    [Markup.button.callback(favoriteText, favoriteCallback)],
    [Markup.button.url('🔗 Открыть ГДЗ', subject.url)],
    [Markup.button.webApp('📱 Открыть Web App', WEB_APP_URL)],
    [
      Markup.button.callback('◀️ Назад к предметам', `class_${classNum}`),
      Markup.button.callback('🏠 Главная', 'back_to_main')
    ]
  ]);
  
  await ctx.replyWithMarkdown(text, {
    ...keyboard,
    disable_web_page_preview: true
  });
}

// Показать избранное
async function showFavorites(ctx) {
  const userId = ctx.from.id.toString();
  const favorites = userFavorites[userId] || [];
  
  if (favorites.length === 0) {
    const text = `
⭐ *Избранное*

У вас пока нет избранных предметов.

💡 *Совет:*
Добавляйте предметы в избранное для быстрого доступа!
А еще больше функций в нашем *Web App* прямо в Telegram!
    `;
    
    const keyboard = Markup.inlineKeyboard([
      [Markup.button.webApp('📱 Открыть Web App', WEB_APP_URL)],
      [Markup.button.callback('◀️ Назад', 'back_to_main')]
    ]);
    
    await ctx.replyWithMarkdown(text, keyboard);
    return;
  }
  
  let text = "⭐ *Ваше избранное:*\n\n";
  const buttons = [];
  
  favorites.forEach((subject, index) => {
    if (index < 10) { // Ограничиваем показ 10 предметами
      text += `${subject.icon} *${subject.name}*\n`;
      text += `Автор: ${subject.author} | Класс: ${subject.class}\n`;
      text += `[Ссылка](${subject.url})\n\n`;
      
      // Находим индекс предмета в основном массиве
      const subjects = SUBJECTS_DATA[subject.class] || [];
      const subjectIndex = subjects.findIndex(s => s.url === subject.url);
      
      if (subjectIndex !== -1) {
        buttons.push([Markup.button.callback(
          `${subject.icon} ${subject.name}`,
          `subject_${subject.class}_${subjectIndex}`
        )]);
      }
    }
  });
  
  text += "\n💡 *Еще больше функций в Web App прямо в Telegram!*";
  
  buttons.push([Markup.button.callback('🗑️ Очистить избранное', 'clear_favorites')]);
  buttons.push([Markup.button.webApp('📱 Открыть Web App', WEB_APP_URL)]);
  buttons.push([Markup.button.callback('◀️ Назад', 'back_to_main')]);
  
  const keyboard = Markup.inlineKeyboard(buttons);
  
  await ctx.replyWithMarkdown(text, {
    ...keyboard,
    disable_web_page_preview: true
  });
}

// Обработка callback запросов
bot.on('callback_query', async (ctx) => {
  const data = ctx.callbackQuery.data;
  
  try {
    if (data === 'back_to_main') {
      await ctx.deleteMessage();
      await bot.telegram.sendMessage(ctx.chat.id, "Главное меню:", {
        reply_markup: { remove_keyboard: true }
      });
      return bot.start(ctx);
    }
    
    if (data === 'classes') {
      await ctx.answerCbQuery();
      await ctx.deleteMessage();
      return bot.telegram.sendMessage(ctx.chat.id, "Выбор классов:", {
        reply_markup: { remove_keyboard: true }
      }).then(() => bot.command('classes', ctx));
    }
    
    if (data.startsWith('class_')) {
      const classNum = data.split('_')[1];
      await ctx.answerCbQuery();
      await ctx.deleteMessage();
      return showClassSubjects(ctx, classNum);
    }
    
    if (data.startsWith('subject_')) {
      const parts = data.split('_');
      const classNum = parts[1];
      const subjectIndex = parseInt(parts[2]);
      await ctx.answerCbQuery();
      await ctx.deleteMessage();
      return showSubjectInfo(ctx, classNum, subjectIndex);
    }
    
    if (data.startsWith('add_fav_')) {
      const parts = data.split('_');
      const classNum = parts[2];
      const subjectIndex = parseInt(parts[3]);
      const subject = SUBJECTS_DATA[classNum][subjectIndex];
      const userId = ctx.from.id.toString();
      
      if (!userFavorites[userId]) {
        userFavorites[userId] = [];
      }
      
      if (!userFavorites[userId].some(fav => fav.url === subject.url)) {
        userFavorites[userId].push({
          ...subject,
          class: classNum
        });
      }
      
      await ctx.answerCbQuery('✅ Добавлено в избранное!');
      await ctx.deleteMessage();
      return showSubjectInfo(ctx, classNum, subjectIndex);
    }
    
    if (data.startsWith('remove_fav_')) {
      const parts = data.split('_');
      const classNum = parts[2];
      const subjectIndex = parseInt(parts[3]);
      const subject = SUBJECTS_DATA[classNum][subjectIndex];
      const userId = ctx.from.id.toString();
      
      if (userFavorites[userId]) {
        userFavorites[userId] = userFavorites[userId].filter(fav => fav.url !== subject.url);
      }
      
      await ctx.answerCbQuery('❌ Удалено из избранного!');
      await ctx.deleteMessage();
      return showSubjectInfo(ctx, classNum, subjectIndex);
    }
    
    if (data === 'favorites') {
      await ctx.answerCbQuery();
      await ctx.deleteMessage();
      return showFavorites(ctx);
    }
    
    if (data === 'clear_favorites') {
      const userId = ctx.from.id.toString();
      userFavorites[userId] = [];
      await ctx.answerCbQuery('✅ Избранное очищено!');
      await ctx.deleteMessage();
      return showFavorites(ctx);
    }
    
    if (data === 'help') {
      await ctx.answerCbQuery();
      await ctx.deleteMessage();
      return bot.telegram.sendMessage(ctx.chat.id, "Помощь:", {
        reply_markup: { remove_keyboard: true }
      }).then(() => bot.command('help', ctx));
    }
    
    if (data === 'bot_status') {
      await ctx.answerCbQuery();
      await ctx.deleteMessage();
      return bot.telegram.sendMessage(ctx.chat.id, "Статус бота:", {
        reply_markup: { remove_keyboard: true }
      }).then(() => bot.command('status', ctx));
    }
    
    if (data === 'refresh') {
      await ctx.answerCbQuery('🔄 Меню обновлено!');
      await ctx.deleteMessage();
      return bot.start(ctx);
    }
    
    if (data === 'open_miniapp') {
      await ctx.answerCbQuery();
      await ctx.deleteMessage();
      return bot.command('webapp', ctx);
    }
    
  } catch (error) {
    console.error('Error handling callback:', error);
    await ctx.answerCbQuery('⚠️ Произошла ошибка');
  }
});

// Обработка текстовых сообщений
bot.on('text', async (ctx) => {
  const text = ctx.message.text.toLowerCase();
  
  if (['привет', 'начать', 'старт', 'start', 'hello', 'hi'].includes(text)) {
    return bot.start(ctx);
  } else if (['помощь', 'help', 'справка'].includes(text)) {
    return bot.command('help', ctx);
  } else if (['webapp', 'веб', 'сайт', 'web', 'сайт', 'браузер', 'miniapp', 'мини апп', 'приложение', 'app', 'минияпп'].includes(text)) {
    return bot.command('webapp', ctx);
  } else if (['классы', 'предметы', 'classes', 'уроки', 'гдз'].includes(text)) {
    return bot.command('classes', ctx);
  } else if (['избранное', 'favorites', 'fav', 'любимые', 'закладки'].includes(text)) {
    return showFavorites(ctx);
  } else if (['статус', 'status', 'работа', 'бот'].includes(text)) {
    return bot.command('status', ctx);
  } else {
    const replyText = `
🤔 Не совсем понимаю ваш запрос.

*Попробуйте:*
• Выбрать класс через меню
• Открыть *Web App* для поиска прямо в Telegram
• Использовать команду /help

*Или напишите:* привет, помощь, webapp, статус
    `;
    
    const keyboard = Markup.inlineKeyboard([
      [Markup.button.webApp('📱 Открыть Web App', WEB_APP_URL)],
      [
        Markup.button.callback('📚 Выбрать класс', 'classes'),
        Markup.button.callback('ℹ️ Помощь', 'help')
      ]
    ]);
    
    await ctx.replyWithMarkdown(replyText, keyboard);
  }
});

// Обработка ошибок
bot.catch((err, ctx) => {
  console.error(`Error for ${ctx.updateType}:`, err);
  ctx.reply('⚠️ Произошла ошибка. Пожалуйста, попробуйте еще раз.');
});

// Запуск сервера
async function startServer() {
  try {
    console.log('='.repeat(60));
    console.log('🚀 ГДЗ НАВИГАТОР БОТ - RENDER.COM');
    console.log('📚 Версия 2.0 (Node.js)');
    console.log('='.repeat(60));
    
    // Проверяем токен
    if (!process.env.BOT_TOKEN) {
      console.error('❌ ОШИБКА: BOT_TOKEN не найден в переменных окружения!');
      console.log('\n📝 Как исправить в Render:');
      console.log('1. Перейдите в Render Dashboard');
      console.log('2. Выберите ваше приложение');
      console.log('3. Перейдите в Environment');
      console.log('4. Добавьте новую переменную:');
      console.log('   Key: BOT_TOKEN');
      console.log('   Value: ваш_токен_бота');
      console.log('5. Нажмите Save');
      console.log('6. Перезапустите деплой');
      console.log('='.repeat(60));
      process.exit(1);
    }
    
    // Запускаем веб-сервер
    app.listen(PORT, () => {
      console.log(`🌐 Web сервер запущен на порту ${PORT}`);
      console.log(`🔗 URL: http://localhost:${PORT}`);
      console.log(`🔗 Health check: http://localhost:${PORT}/health`);
    });
    
    // Запускаем бота
    console.log('🤖 Запуск Telegram бота...');
    await bot.launch();
    console.log('✅ Telegram бот запущен!');
    console.log(`👤 Бот: @${bot.botInfo.username}`);
    console.log(`📱 Web App URL: ${WEB_APP_URL}`);
    console.log('='.repeat(60));
    console.log('✅ Приложение готово к работе!');
    console.log('👉 Отправьте /start в Telegram');
    console.log('👉 Веб-страница доступна по Render URL');
    console.log('='.repeat(60));
    
    // Обработка сигналов для graceful shutdown
    process.once('SIGINT', () => bot.stop('SIGINT'));
    process.once('SIGTERM', () => bot.stop('SIGTERM'));
    
  } catch (error) {
    console.error('❌ Ошибка при запуске:', error);
    process.exit(1);
  }
}

// Запускаем сервер
startServer();
