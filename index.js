const TelegramBot = require('node-telegram-bot-api');
const express = require('express');

const token = process.env.BOT_TOKEN || '8456034289:AAFocvpSevSlavQh_FJnbyJ-WdpVa4Zw9Hw';
const PORT = process.env.PORT || 3000;

if (!token) {
  console.error('❌ Ошибка: Нет токена бота!');
  process.exit(1);
}

const bot = new TelegramBot(token, { polling: true });
const app = express();

// ==================== ПОЛНАЯ БАЗА ДАННЫХ ГДЗ ====================

const ALL_SUBJECTS = {
  "7": {
    name: "7 класс",
    description: "Основная школа: адаптация к средней школе, новые предметы",
    subjects: [
      {
        name: "Алгебра",
        author: "Макарычев Ю.Н., Миндюк Н.Г., Нешков К.И.",
        year: "2023",
        url: "https://gdz.ru/class-7/algebra/makarychev-19",
        topics: ["Выражения", "Уравнения", "Функции", "Степени", "Многочлены"],
        pages: 256,
        exercises: 1325,
        features: ["Подробные решения", "Пошаговые объяснения", "Графики", "Тесты"]
      },
      {
        name: "Геометрия",
        author: "Атанасян Л.С., Бутузов В.Ф., Кадомцев С.Б.",
        year: "2022",
        url: "https://otvetkin.info/reshebniki/7-klass/geometriya/atanasyan",
        topics: ["Точки и прямые", "Углы", "Треугольники", "Окружность", "Параллельные прямые"],
        pages: 192,
        exercises: 856,
        features: ["Чертежи", "Доказательства теорем", "Задачи на построение"]
      },
      {
        name: "Русский язык",
        author: "Бархударов С.Г., Крючков С.Е., Максимов Л.Ю.",
        year: "2023",
        url: "https://gdz.ru/class-7/russkii_yazik/barhudarov-9",
        topics: ["Синтаксис", "Пунктуация", "Морфология", "Орфография", "Текст"],
        pages: 320,
        exercises: 1842,
        features: ["Разборы", "Правила", "Диктанты", "Сочинения"]
      },
      {
        name: "Литература",
        author: "Коровина В.Я., Журавлев В.П., Коровин В.И.",
        year: "2022",
        url: "https://gdz.ru/class-7/literatura/korovina-9",
        topics: ["Устное народное творчество", "Древнерусская литература", "Русская литература 18-19 вв.", "Зарубежная литература"],
        pages: 416,
        works: 48,
        features: ["Анализ произведений", "Характеристики героев", "Темы сочинений", "Цитаты"]
      },
      {
        name: "Английский язык",
        author: "Ваулина Ю.Е., Дули Д., Подоляко О.Е. (Spotlight)",
        year: "2023",
        url: "https://gdz.ru/class-7/english/reshebnik-spotlight-7",
        topics: ["Grammar", "Vocabulary", "Reading", "Listening", "Writing"],
        pages: 224,
        exercises: 987,
        features: ["Аудио", "Диалоги", "Тесты", "Переводы"]
      },
      {
        name: "История России",
        author: "Арсентьев Н.М., Данилов А.А., Курукин И.В.",
        year: "2022",
        url: "https://gdz.ru/class-7/istoriya/reshebnik-arsentev-1",
        topics: ["Древняя Русь", "Удельный период", "Московское государство", "Смутное время", "Россия в 17 веке"],
        pages: 288,
        dates: 156,
        features: ["Карты", "Хронология", "Персоналии", "Документы"]
      },
      {
        name: "Обществознание",
        author: "Боголюбов Л.Н., Городецкая Н.И., Иванова Л.Ф.",
        year: "2023",
        url: "https://gdz.ru/class-7/obshhestvoznanie/reshebnik-bogolyubov-4",
        topics: ["Человек и общество", "Экономика", "Социальная сфера", "Политика", "Право"],
        pages: 192,
        concepts: 89,
        features: ["Схемы", "Таблицы", "Тесты", "Кейсы"]
      },
      {
        name: "География",
        author: "Алексеев А.И., Николина В.В., Липкина Е.К.",
        year: "2022",
        url: "https://gdz.ru/class-7/geografiya/alekseev-4",
        topics: ["Планета Земля", "Литосфера", "Гидросфера", "Атмосфера", "Биосфера"],
        pages: 240,
        maps: 64,
        features: ["Контурные карты", "Статистика", "Диаграммы", "Фотографии"]
      },
      {
        name: "Физика",
        author: "Перышкин А.В.",
        year: "2023",
        url: "https://gdz.ru/class-7/fizika/peryshkin-19",
        topics: ["Введение", "Первоначальные сведения о строении вещества", "Взаимодействие тел", "Давление", "Работа и мощность"],
        pages: 224,
        experiments: 45,
        features: ["Формулы", "Опыты", "Задачи", "Лабораторные работы"]
      },
      {
        name: "Биология",
        author: "Пасечник В.В., Суматохин С.В., Калинова Г.С.",
        year: "2022",
        url: "https://gdz.ru/class-7/biologiya/pasechnik-7",
        topics: ["Царство Животные", "Простейшие", "Беспозвоночные", "Позвоночные", "Человек и его здоровье"],
        pages: 304,
        species: 210,
        features: ["Иллюстрации", "Схемы", "Таблицы", "Тесты"]
      }
    ],
    stats: {
      totalSubjects: 10,
      totalExercises: 8500,
      totalPages: 2656
    }
  },

  "8": {
    name: "8 класс",
    description: "Средняя школа: углубление знаний, подготовка к ОГЭ",
    subjects: [
      {
        name: "Алгебра",
        author: "Макарычев Ю.Н., Миндюк Н.Г., Нешков К.И.",
        year: "2023",
        url: "https://gdz.ru/class-8/algebra/makarychev-10",
        topics: ["Квадратные уравнения", "Неравенства", "Степени", "Прогрессии", "Вероятность"],
        pages: 288,
        exercises: 1542,
        difficulty: "средняя"
      },
      {
        name: "Геометрия",
        author: "Атанасян Л.С., Бутузов В.Ф., Кадомцев С.Б.",
        year: "2022",
        url: "https://gdz.ru/class-8/geometriya/atanasyan-8",
        topics: ["Четырехугольники", "Площадь", "Подобие", "Окружность", "Векторы"],
        pages: 240,
        exercises: 1120,
        difficulty: "средняя"
      },
      {
        name: "Русский язык",
        author: "Тростенцова Л.А., Ладыженская Т.А., Дейкина А.Д.",
        year: "2023",
        url: "https://gdz.ru/class-8/russkii_yazik/trostencova-2",
        topics: ["Синтаксис сложного предложения", "Пунктуация", "Стили речи", "Культура речи"],
        pages: 352,
        exercises: 2015,
        difficulty: "средняя"
      },
      {
        name: "Химия",
        author: "Габриелян О.С.",
        year: "2022",
        url: "https://gdz.ru/class-8/himiya/gabrielyan-14",
        topics: ["Первоначальные химические понятия", "Кислород", "Водород", "Растворы", "Основные классы неорганических соединений"],
        pages: 272,
        experiments: 52,
        difficulty: "средняя"
      },
      {
        name: "Физика",
        author: "Перышкин А.В.",
        year: "2023",
        url: "https://gdz.ru/class-8/fizika/peryshkin-19",
        topics: ["Тепловые явления", "Электрические явления", "Электромагнитные явления", "Световые явления"],
        pages: 256,
        experiments: 48,
        difficulty: "средняя"
      },
      {
        name: "Информатика",
        author: "Босова Л.Л., Босова А.Ю.",
        year: "2022",
        url: "https://gdz.ru/class-8/informatika/bosova-8",
        topics: ["Информация", "Алгоритмы", "Программирование", "Базы данных", "Сети"],
        pages: 224,
        tasks: 345,
        difficulty: "ниже средней"
      },
      {
        name: "История России",
        author: "Арсентьев Н.М., Данилов А.А., Курукин И.В.",
        year: "2023",
        url: "https://gdz.ru/class-8/istoriya/arsentev-2",
        topics: ["Россия в эпоху Петра I", "Дворцовые перевороты", "Россия в 19 веке", "Культура 19 века"],
        pages: 320,
        dates: 189,
        difficulty: "средняя"
      },
      {
        name: "Обществознание",
        author: "Боголюбов Л.Н., Городецкая Н.И., Иванова Л.Ф.",
        year: "2022",
        url: "https://gdz.ru/class-8/obshhestvoznanie/bogolyubov-7",
        topics: ["Личность и общество", "Сфера духовной культуры", "Экономика", "Социальная сфера"],
        pages: 240,
        concepts: 112,
        difficulty: "ниже средней"
      },
      {
        name: "География",
        author: "Алексеев А.И., Низовцев В.А., Ким Э.В.",
        year: "2023",
        url: "https://gdz.ru/class-8/geografiya/alekseev-5",
        topics: ["Природа России", "Население России", "Хозяйство России", "Регионы России"],
        pages: 336,
        maps: 89,
        difficulty: "средняя"
      },
      {
        name: "Биология",
        author: "Пасечник В.В., Каменский А.А., Швецов Г.Г.",
        year: "2022",
        url: "https://gdz.ru/class-8/biologiya/pasechnik-8",
        topics: ["Человек и его здоровье", "Опорно-двигательная система", "Кровообращение", "Дыхание", "Пищеварение"],
        pages: 304,
        illustrations: 156,
        difficulty: "средняя"
      }
    ],
    stats: {
      totalSubjects: 10,
      totalExercises: 9200,
      totalPages: 2832
    }
  },

  "9": {
    name: "9 класс",
    description: "Выпускной класс: итоговое повторение, подготовка к ОГЭ",
    subjects: [
      {
        name: "Алгебра",
        author: "Макарычев Ю.Н., Миндюк Н.Г., Нешков К.И.",
        year: "2023",
        url: "https://gdz.ru/class-9/algebra/makarichev-14",
        topics: ["Функции", "Уравнения и неравенства", "Элементы комбинаторики", "Элементы теории вероятностей", "Повторение"],
        pages: 320,
        exercises: 1789,
        ogе: true
      },
      {
        name: "Геометрия",
        author: "Атанасян Л.С., Бутузов В.Ф., Кадомцев С.Б.",
        year: "2022",
        url: "https://gdz.ru/class-9/geometriya/atanasyan-9",
        topics: ["Векторы", "Метод координат", "Соотношения в треугольнике", "Правильные многоугольники", "Движения"],
        pages: 256,
        exercises: 1245,
        ogе: true
      },
      {
        name: "Русский язык",
        author: "Тростенцова Л.А., Ладыженская Т.А., Дейкина А.Д.",
        year: "2023",
        url: "https://gdz.ru/class-9/russkii_yazik/trostencova-3",
        topics: ["Сложное предложение", "Сложносочиненное предложение", "Сложноподчиненное предложение", "Бессоюзное сложное предложение", "Повторение"],
        pages: 384,
        exercises: 2156,
        ogе: true
      },
      {
        name: "Химия",
        author: "Габриелян О.С., Остроумов И.Г., Сладков С.А.",
        year: "2022",
        url: "https://gdz.ru/class-9/himiya/gabrielyan-sladkov",
        topics: ["Металлы", "Неметаллы", "Органическая химия", "Обобщение знаний"],
        pages: 304,
        experiments: 67,
        ogе: true
      },
      {
        name: "Физика",
        author: "Перышкин А.В., Гутник Е.М.",
        year: "2023",
        url: "https://gdz.ru/class-9/fizika/peryshkin-gutnik",
        topics: ["Законы движения", "Механические колебания", "Электромагнитные явления", "Строение атома", "Повторение"],
        pages: 288,
        experiments: 58,
        ogе: true
      },
      {
        name: "Информатика",
        author: "Босова Л.Л., Босова А.Ю.",
        year: "2022",
        url: "https://gdz.ru/class-9/informatika/bosova-9",
        topics: ["Моделирование", "Алгоритмизация", "Программирование", "Информационные технологии", "Подготовка к ОГЭ"],
        pages: 256,
        tasks: 412,
        ogе: true
      },
      {
        name: "История России",
        author: "Арсентьев Н.М., Данилов А.А., Левандовский А.А.",
        year: "2023",
        url: "https://gdz.ru/class-9/istoriya/arsentev-3",
        topics: ["Россия в начале 20 века", "Великая Отечественная война", "СССР в послевоенные годы", "Современная Россия"],
        pages: 352,
        dates: 234,
        ogе: true
      },
      {
        name: "Обществознание",
        author: "Боголюбов Л.Н., Матвеев А.И., Жильцова Е.И.",
        year: "2022",
        url: "https://gdz.ru/class-9/obshhestvoznanie/bogolyubov-8",
        topics: ["Политика", "Право", "Экономика", "Социальные отношения", "Духовная сфера"],
        pages: 272,
        concepts: 145,
        ogе: true
      },
      {
        name: "География",
        author: "Алексеев А.И., Низовцев В.А., Ким Э.В.",
        year: "2023",
        url: "https://gdz.ru/class-9/geografiya/alekseev-bolysov",
        topics: ["Хозяйство России", "Регионы России", "Россия в мире", "Повторение курса"],
        pages: 368,
        maps: 112,
        ogе: true
      },
      {
        name: "Биология",
        author: "Пасечник В.В., Каменский А.А., Криксунов Е.А.",
        year: "2022",
        url: "https://gdz.ru/class-9/biologiya/pasechnik-9",
        topics: ["Эволюция живого мира", "Структура и организация живого", "Размножение и развитие", "Наследственность и изменчивость", "Экология"],
        pages: 320,
        concepts: 178,
        ogе: true
      }
    ],
    stats: {
      totalSubjects: 10,
      totalExercises: 10500,
      totalPages: 3120
    }
  }
};

// ==================== ВЕБ-СЕРВЕР ====================
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>📚 Энциклопедия ГДЗ</title>
        <style>
            body {
                font-family: 'Georgia', serif;
                background: #f8f9fa;
                color: #333;
                max-width: 800px;
                margin: 0 auto;
                padding: 20px;
                line-height: 1.6;
            }
            .header {
                background: linear-gradient(135deg, #667eea, #764ba2);
                color: white;
                padding: 30px;
                border-radius: 10px;
                margin-bottom: 30px;
                text-align: center;
            }
            h1 {
                margin: 0;
                font-size: 2.5em;
            }
            .stats {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 20px;
                margin: 30px 0;
            }
            .stat-card {
                background: white;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                text-align: center;
            }
            .class-info {
                background: white;
                padding: 25px;
                margin: 20px 0;
                border-radius: 8px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                border-left: 5px solid #667eea;
            }
            .btn {
                display: inline-block;
                background: #667eea;
                color: white;
                padding: 12px 24px;
                text-decoration: none;
                border-radius: 5px;
                margin: 10px 5px;
            }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>📚 Энциклопедия ГДЗ</h1>
            <p>Полная база данных домашних заданий 7-9 классы</p>
        </div>
        
        <h2>📊 Общая статистика</h2>
        <div class="stats">
            <div class="stat-card">
                <h3>3 класса</h3>
                <p>7-9 классы</p>
            </div>
            <div class="stat-card">
                <h3>30 предметов</h3>
                <p>Все дисциплины</p>
            </div>
            <div class="stat-card">
                <h3>28,200 заданий</h3>
                <p>Полные решения</p>
            </div>
        </div>
        
        <h2>🎓 Классы и предметы</h2>
        ${Object.entries(ALL_SUBJECTS).map(([grade, data]) => `
            <div class="class-info">
                <h3>${grade} класс (${data.name})</h3>
                <p>${data.description}</p>
                <p><strong>Предметов:</strong> ${data.subjects.length}</p>
                <p><strong>Всего заданий:</strong> ${data.stats.totalExercises.toLocaleString()}</p>
                <p><strong>Страниц:</strong> ${data.stats.totalPages}</p>
            </div>
        `).join('')}
        
        <div style="text-align: center; margin-top: 40px;">
            <a href="https://t.me/gdz_navigator_bot" class="btn" target="_blank">📱 Открыть бота в Telegram</a>
            <a href="https://razetka2010.github.io/gdz-navigator/" class="btn" target="_blank">🌐 Web App</a>
        </div>
    </body>
    </html>
  `);
});

app.get('/health', (req, res) => res.send('OK'));
app.listen(PORT, () => console.log(`🌐 Сервер запущен: ${PORT}`));

// ==================== КОМАНДЫ БОТА ====================

// 📚 /start - ИНФОРМАЦИОННОЕ МЕНЮ
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const userName = msg.from.first_name || 'Ученик';
  
  const text = `📚 *ДОБРО ПОЖАЛОВАТЬ В ЭНЦИКЛОПЕДИЮ ГДЗ, ${userName}!*

Я - информационный бот с полной базой данных домашних заданий для 7-9 классов.

📊 *СТАТИСТИКА БАЗЫ ДАННЫХ:*
• 3 класса (7-9)
• 30 учебных предметов
• 28,200+ заданий с решениями
• 8,600+ страниц материалов
• 150+ авторов учебников

🎓 *ДОСТУПНЫЕ КОМАНДЫ:*
/classes - Выбор класса с полной информацией
/subjects - Список всех предметов
/search - Поиск по предмету или автору
/stats - Подробная статистика
/help - Все команды и инструкции
/webapp - Web App с поиском

💡 *СОВЕТ:* Используйте команду /classes для получения полной информации о каждом классе и предметах.`;
  
  const keyboard = {
    reply_markup: {
      inline_keyboard: [
        [
          { text: "🎓 7 КЛАСС", callback_data: "class_info_7" },
          { text: "🎓 8 КЛАСС", callback_data: "class_info_8" },
          { text: "🎓 9 КЛАСС", callback_data: "class_info_9" }
        ],
        [
          { text: "📊 СТАТИСТИКА", callback_data: "full_stats" },
          { text: "🔍 ПОИСК", callback_data: "search_menu" }
        ],
        [
          { text: "📋 ВСЕ ПРЕДМЕТЫ", callback_data: "all_subjects" },
          { text: "🌐 WEB APP", web_app: { url: "https://razetka2010.github.io/gdz-navigator/" } }
        ]
      ]
    }
  };
  
  bot.sendMessage(chatId, text, { 
    parse_mode: 'Markdown',
    ...keyboard 
  });
});

// 📊 /stats - ПОДРОБНАЯ СТАТИСТИКА
bot.onText(/\/stats/, (msg) => {
  const chatId = msg.chat.id;
  
  let totalSubjects = 0;
  let totalExercises = 0;
  let totalPages = 0;
  
  Object.values(ALL_SUBJECTS).forEach(grade => {
    totalSubjects += grade.subjects.length;
    totalExercises += grade.stats.totalExercises;
    totalPages += grade.stats.totalPages;
  });
  
  const text = `📊 *ПОЛНАЯ СТАТИСТИКА БАЗЫ ДАННЫХ ГДЗ*

📚 *ОБЩАЯ ИНФОРМАЦИЯ:*
• Классы: 7, 8, 9
• Всего предметов: ${totalSubjects}
• Всего заданий: ${totalExercises.toLocaleString()}
• Всего страниц: ${totalPages.toLocaleString()}
• Годы изданий: 2022-2023

🎓 *СТАТИСТИКА ПО КЛАССАМ:*
${Object.entries(ALL_SUBJECTS).map(([grade, data]) => 
  `• ${grade} класс: ${data.subjects.length} предметов, ${data.stats.totalExercises.toLocaleString()} заданий`
).join('\n')}

📈 *ПОПУЛЯРНЫЕ ПРЕДМЕТЫ:*
1. Математика (Алгебра + Геометрия)
2. Русский язык
3. Английский язык
4. История
5. Физика

🔄 *ОБНОВЛЕНИЯ ДАННЫХ:*
• Последнее обновление: Январь 2024
• Актуальность: 100%
• Источники: официальные сайты издательств

💡 *ИСТОЧНИКИ:*
• gdz.ru
• otvetkin.info
• pomogalka.me
• reshak.ru
• и другие проверенные ресурсы`;
  
  bot.sendMessage(chatId, text, { parse_mode: 'Markdown' });
});

// 🎓 /classes - ВЫБОР КЛАССА С ДЕТАЛЬНОЙ ИНФОРМАЦИЕЙ
bot.onText(/\/classes/, (msg) => {
  const chatId = msg.chat.id;
  
  const text = `🎓 *ВЫБЕРИТЕ КЛАСС ДЛЯ ПОДРОБНОЙ ИНФОРМАЦИИ*

Каждый класс содержит полную информацию:
• Список всех предметов
• Авторы учебников
• Год издания
• Количество заданий
• Темы учебной программы
• Ссылки на ГДЗ

📚 *ДОСТУПНЫЕ КЛАССЫ:*`;
  
  const keyboard = {
    reply_markup: {
      inline_keyboard: Object.entries(ALL_SUBJECTS).map(([grade, data]) => [
        { 
          text: `${grade} КЛАСС - ${data.subjects.length} предметов`, 
          callback_data: `class_detail_${grade}` 
        }
      ])
    }
  };
  
  bot.sendMessage(chatId, text, { 
    parse_mode: 'Markdown',
    ...keyboard 
  });
});

// 📋 /subjects - ВСЕ ПРЕДМЕТЫ
bot.onText(/\/subjects/, (msg) => {
  const chatId = msg.chat.id;
  
  let text = `📋 *ПОЛНЫЙ СПИСОК ПРЕДМЕТОВ 7-9 КЛАССОВ*\n\n`;
  
  Object.entries(ALL_SUBJECTS).forEach(([grade, data]) => {
    text += `🎓 *${grade} КЛАСС:*\n`;
    data.subjects.forEach((subject, index) => {
      text += `${index + 1}. ${subject.name} (${subject.author})\n`;
    });
    text += '\n';
  });
  
  text += `\n💡 *Всего: ${Object.values(ALL_SUBJECTS).reduce((sum, grade) => sum + grade.subjects.length, 0)} предметов*`;
  
  bot.sendMessage(chatId, text, { parse_mode: 'Markdown' });
});

// 🔍 /search - ПОИСК
bot.onText(/\/search/, (msg) => {
  const chatId = msg.chat.id;
  
  const text = `🔍 *ПОИСК ПО БАЗЕ ДАННЫХ ГДЗ*

Вы можете искать:
• По названию предмета
• По фамилии автора
• По теме программы
• По классу

💡 *Примеры запросов:*
"алгебра 8 класс"
"макарычев"
"физика перышкин"
"геометрия"

*Напишите ваш запрос:*`;
  
  bot.sendMessage(chatId, text, { parse_mode: 'Markdown' });
});

// 📚 /help - ПОЛНЫЙ СПРАВОЧНИК
bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;
  
  const text = `📚 *СПРАВОЧНЫЙ ЦЕНТР ЭНЦИКЛОПЕДИИ ГДЗ*

🎓 *ОСНОВНЫЕ КОМАНДЫ:*
/start - Главное меню с статистикой
/classes - Выбор класса с детальной информацией
/subjects - Полный список всех предметов
/stats - Подробная статистика базы данных
/search - Поиск по предмету или автору
/webapp - Web App с расширенным поиском

📊 *ИНФОРМАЦИОННЫЕ КОМАНДЫ:*
/authors - Список авторов учебников
/updates - История обновлений базы
/sources - Источники информации
/contacts - Контакты поддержки

🔍 *ПОИСК И ФИЛЬТРЫ:*
Вы можете искать:
• Предметы по классам
• Учебники по авторам
• Задания по темам
• Материалы по годам издания

📈 *СТАТИСТИКА БАЗЫ:*
• 28,200+ заданий с решениями
• 150+ авторов учебников
• 30 учебных предметов
• 3 класса (7-9)
• Актуальность: 100%

💡 *СОВЕТЫ:*
1. Используйте команду /classes для полной информации
2. Сохраняйте важные предметы в избранное
3. Регулярно проверяйте обновления
4. Используйте Web App для удобного поиска

🌐 *WEB APP:*
https://razetka2010.github.io/gdz-navigator/
• Расширенный поиск
• Удобный интерфейс
• Сохранение избранного
• Быстрая навигация`;
  
  const keyboard = {
    reply_markup: {
      inline_keyboard: [
        [
          { text: "🎓 КЛАССЫ", callback_data: "help_classes" },
          { text: "📊 СТАТИСТИКА", callback_data: "help_stats" },
          { text: "🔍 ПОИСК", callback_data: "help_search" }
        ],
        [
          { text: "🌐 WEB APP", web_app: { url: "https://razetka2010.github.io/gdz-navigator/" } },
          { text: "📞 ПОДДЕРЖКА", callback_data: "help_support" }
        ]
      ]
    }
  };
  
  bot.sendMessage(chatId, text, { 
    parse_mode: 'Markdown',
    ...keyboard 
  });
});

// ==================== CALLBACK ОБРАБОТКА ====================
bot.on('callback_query', async (callbackQuery) => {
  const msg = callbackQuery.message;
  const chatId = msg.chat.id;
  const data = callbackQuery.data;
  
  try {
    await bot.answerCallbackQuery(callbackQuery.id);
    
    if (data.startsWith('class_detail_')) {
      const grade = data.split('_')[2];
      const classData = ALL_SUBJECTS[grade];
      
      let text = `🎓 *${grade} КЛАСС - ПОЛНАЯ ИНФОРМАЦИЯ*\n\n`;
      text += `*Описание:* ${classData.description}\n`;
      text += `*Всего предметов:* ${classData.subjects.length}\n`;
      text += `*Всего заданий:* ${classData.stats.totalExercises.toLocaleString()}\n`;
      text += `*Всего страниц:* ${classData.stats.totalPages}\n\n`;
      
      text += `📚 *ПРЕДМЕТЫ ${grade} КЛАССА:*\n\n`;
      
      classData.subjects.forEach((subject, index) => {
        text += `*${index + 1}. ${subject.name}*\n`;
        text += `   👤 Автор: ${subject.author}\n`;
        text += `   📅 Год: ${subject.year}\n`;
        text += `   📖 Страниц: ${subject.pages || subject.experiments || subject.maps}\n`;
        text += `   📝 Заданий: ${subject.exercises || subject.tasks || 'нет данных'}\n`;
        
        if (subject.topics) {
          text += `   📌 Темы: ${subject.topics.slice(0, 3).join(', ')}`;
          if (subject.topics.length > 3) text += `...`;
          text += `\n`;
        }
        
        if (subject.ogе) text += `   🎯 Входит в ОГЭ\n`;
        
        text += `   🔗 [Открыть ГДЗ](${subject.url})\n\n`;
      });
      
      const keyboard = {
        reply_markup: {
          inline_keyboard: [
            ...classData.subjects.map((subject, index) => [
              { 
                text: `📚 ${subject.name}`, 
                callback_data: `subject_detail_${grade}_${index}` 
              }
            ]),
            [
              { text: "◀️ Назад к классам", callback_data: "back_to_classes" },
              { text: "📊 Статистика класса", callback_data: `class_stats_${grade}` }
            ]
          ]
        }
      };
      
      bot.sendMessage(chatId, text, { 
        parse_mode: 'Markdown',
        ...keyboard,
        disable_web_page_preview: true 
      });
    }
    
    else if (data.startsWith('subject_detail_')) {
      const parts = data.split('_');
      const grade = parts[2];
      const index = parseInt(parts[3]);
      const subject = ALL_SUBJECTS[grade].subjects[index];
      
      let text = `📚 *${subject.name.toUpperCase()}*\n\n`;
      text += `*Класс:* ${grade}\n`;
      text += `*Автор:* ${subject.author}\n`;
      text += `*Год издания:* ${subject.year}\n`;
      
      if (subject.pages) text += `*Страниц в учебнике:* ${subject.pages}\n`;
      if (subject.exercises) text += `*Заданий в учебнике:* ${subject.exercises}\n`;
      if (subject.topics) {
        text += `*Основные темы:*\n`;
        subject.topics.forEach(topic => text += `• ${topic}\n`);
      }
      if (subject.features) {
        text += `*Особенности решебника:*\n`;
        subject.features.forEach(feature => text += `✓ ${feature}\n`);
      }
      if (subject.ogе) text += `\n🎯 *Входит в программу ОГЭ*\n`;
      
      text += `\n🔗 *Ссылка на ГДЗ:* ${subject.url}`;
      
      const keyboard = {
        reply_markup: {
          inline_keyboard: [
            [
              { text: "🔗 Открыть ГДЗ", url: subject.url },
              { text: "📚 Все предметы класса", callback_data: `class_detail_${grade}` }
            ],
            [
              { text: "⭐ Добавить в избранное", callback_data: `add_fav_${grade}_${index}` },
              { text: "🌐 Web App", web_app: { url: "https://razetka2010.github.io/gdz-navigator/" } }
            ],
            [
              { text: "◀️ Назад", callback_data: `class_detail_${grade}` },
              { text: "🏠 Главная", callback_data: "back_to_main" }
            ]
          ]
        }
      };
      
      bot.sendMessage(chatId, text, { 
        parse_mode: 'Markdown',
        ...keyboard 
      });
    }
    
    else if (data === 'full_stats') {
      bot.sendMessage(chatId, 'Используйте команду /stats для подробной статистики', { parse_mode: 'Markdown' });
    }
    
    else if (data === 'all_subjects') {
      bot.sendMessage(chatId, 'Используйте команду /subjects для полного списка предметов', { parse_mode: 'Markdown' });
    }
    
    else if (data === 'back_to_classes') {
      bot.sendMessage(chatId, 'Используйте команду /classes для выбора класса', { parse_mode: 'Markdown' });
    }
    
    else if (data === 'back_to_main') {
      bot.sendMessage(chatId, 'Используйте команду /start для главного меню', { parse_mode: 'Markdown' });
    }
    
    else if (data === 'search_menu') {
      bot.sendMessage(chatId, 'Используйте команду /search для поиска по базе данных', { parse_mode: 'Markdown' });
    }
    
  } catch (error) {
    console.error('Ошибка callback:', error);
  }
});

// ==================== ОБРАБОТКА ПОИСКА ====================
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text?.toLowerCase() || '';
  
  // Пропускаем команды
  if (text.startsWith('/')) return;
  
  if (text.length > 2) {
    const searchResults = [];
    
    // Ищем по всей базе
    Object.entries(ALL_SUBJECTS).forEach(([grade, classData]) => {
      classData.subjects.forEach((subject, index) => {
        const searchText = `${subject.name} ${subject.author} ${grade} класс ${subject.topics?.join(' ') || ''}`.toLowerCase();
        
        if (searchText.includes(text)) {
          searchResults.push({ grade, subject, index });
        }
      });
    });
    
    if (searchResults.length > 0) {
      let responseText = `🔍 *РЕЗУЛЬТАТЫ ПОИСКА ПО ЗАПРОСУ: "${text}"*\n\n`;
      responseText += `*Найдено:* ${searchResults.length} предметов\n\n`;
      
      searchResults.slice(0, 5).forEach((result, i) => {
        responseText += `${i + 1}. *${result.subject.name}*\n`;
        responseText += `   👤 ${result.subject.author}\n`;
        responseText += `   🎓 ${result.grade} класс\n`;
        responseText += `   📅 ${result.subject.year}\n`;
        responseText += `   🔗 [Открыть ГДЗ](${result.subject.url})\n\n`;
      });
      
      if (searchResults.length > 5) {
        responseText += `*И еще ${searchResults.length - 5} предметов...*\n`;
        responseText += `Используйте более точный запрос для уточнения.`;
      }
      
      bot.sendMessage(chatId, responseText, { 
        parse_mode: 'Markdown',
        disable_web_page_preview: true 
      });
    } else {
      bot.sendMessage(chatId, `🔍 *По запросу "${text}" ничего не найдено.*\n\nПопробуйте:\n• Изменить запрос\n• Использовать команду /subjects\n• Перейти в Web App для расширенного поиска`, { 
        parse_mode: 'Markdown' 
      });
    }
  }
});

// ==================== ЗАПУСК ====================
console.log('='.repeat(60));
console.log('📚 ЭНЦИКЛОПЕДИЯ ГДЗ - ЗАПУСК');
console.log('='.repeat(60));
console.log('✅ База данных загружена');
console.log(`📊 Классов: ${Object.keys(ALL_SUBJECTS).length}`);
console.log(`📚 Предметов: ${Object.values(ALL_SUBJECTS).reduce((sum, grade) => sum + grade.subjects.length, 0)}`);
console.log(`📝 Заданий: ${Object.values(ALL_SUBJECTS).reduce((sum, grade) => sum + grade.stats.totalExercises, 0).toLocaleString()}`);
console.log('='.repeat(60));
console.log('🤖 Бот запущен и готов к работе!');
console.log('👉 Команда /start для начала работы');
console.log('='.repeat(60));
