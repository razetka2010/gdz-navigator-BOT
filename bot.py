# bot.py - ГДЗ Навигатор Бот для Replit
import os
import logging
import asyncio
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup, WebAppInfo
from telegram.ext import Application, CommandHandler, CallbackQueryHandler, MessageHandler, filters, ContextTypes
from telegram.constants import ParseMode

# Настройка логирования
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO
)
logger = logging.getLogger(__name__)

# =================== КОНФИГУРАЦИЯ ===================

# URL вашего Mini App (замените на реальный URL)
WEB_APP_URL = "https://razetka2010.github.io/gdz-navigator/"

# Данные предметов
SUBJECTS_DATA = {
    "7": [
        {"name": "Геометрия", "author": "Атанасян", "url": "https://otvetkin.info/reshebniki/7-klass/geometriya/atanasyan", "icon": "📐"},
        {"name": "Вероятность и статистика", "author": "Высоцкий, Ященко", "url": "https://gdz.ru/class-7/matematika/vysockij-yashenko-bazovij-uroven", "icon": "📊"},
        {"name": "Физика", "author": "Сборник Лукашик", "url": "https://pomogalka.me/7-klass/fizika/lukashik-ivanova", "icon": "⚡"}
    ],
    "8": [
        {"name": "Алгебра", "author": "Макарычев", "url": "https://otvetkin.info/reshebniki/8-klass/algebra/makarychev", "icon": "🔢"},
        {"name": "Русский язык", "author": "Бархударов", "url": "https://otvetkin.info/reshebniki/8-klass/russkiy-yazyk/barhudarov-fgos", "icon": "📝"},
        {"name": "Английский", "author": "Spotlight 8", "url": "https://gdz.ru/class-8/english/reshebnik-spotlight-8-angliyskiy-v-fokuse-vaulina-yu-e", "icon": "🇬🇧"},
        {"name": "История России", "author": "Арсентьев", "url": "https://pomogalka.me/8-klass/istoriya/arsentev", "icon": "🏛️"},
        {"name": "Химия", "author": "Габриелян", "url": "https://gdz.top/8-klass/himiya/gabrielyan-ostroumov-uchebnik", "icon": "🧪"},
        {"name": "Физика", "author": "Перышкин", "url": "https://gdz.fm/fizika/8-klass/pyoryshkin", "icon": "⚡"},
        {"name": "Обществознание", "author": "Боголюбов", "url": "https://gdz.ru/class-8/obshhestvoznanie/reshebnik-bogolyubov-l-n", "icon": "👥"},
        {"name": "Информатика", "author": "Босова", "url": "https://murnik.ru/gdz-po-informatike-8-klass-bosova", "icon": "💻"}
    ],
    "9": [
        {"name": "Английский", "author": "Spotlight 9", "url": "https://gdz.ru/class-9/english/reshebnik-spotlight-9-vaulina-yu-e", "icon": "🇬🇧"},
        {"name": "Химия", "author": "Габриелян, Сладков", "url": "https://gdz.ru/class-9/himiya/gabrielyan-sladkov", "icon": "🧪"},
        {"name": "География", "author": "Алексеев", "url": "https://gdz.ru/class-9/geografiya/alekseev-bolysov", "icon": "🗺️"},
        {"name": "Физика", "author": "Перышкин", "url": "https://gdz.ru/class-9/fizika/peryshkin-gutnik", "icon": "⚡"},
        {"name": "Обществознание", "author": "Боголюбов", "url": "https://reshak.ru/reshebniki/obshestvo/9/bogolubov/index.html", "icon": "👥"},
        {"name": "Русский язык", "author": "Бархударов", "url": "https://gdz.ru/class-9/russkii_yazik/barhudarov-kruchkov-9", "icon": "📝"},
        {"name": "Литература", "author": "Коровина", "url": "https://pomogalka.me/9-klass/literatura/korovina", "icon": "📚"},
        {"name": "Алгебра", "author": "Макарычев", "url": "https://gdz.ru/class-9/algebra/makarichev-14", "icon": "🔢"}
    ]
}

# Хранилище для избранного (временное, для демонстрации)
# В реальном проекте используйте базу данных
user_favorites = {}

# =================== KEEP ALIVE ДЛЯ REPLIT ===================
try:
    from flask import Flask
    from threading import Thread
    import time
    
    app = Flask('')
    
    @app.route('/')
    def home():
        return """
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
                .info {
                    font-size: 1.1em;
                    line-height: 1.6;
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
                    transition: transform 0.3s;
                }
                .telegram-btn:hover {
                    transform: translateY(-3px);
                    background: #0077b5;
                }
                .footer {
                    margin-top: 30px;
                    font-size: 0.9em;
                    opacity: 0.8;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>📚 ГДЗ Навигатор Бот</h1>
                <div class="status">✅ БОТ АКТИВЕН И РАБОТАЕТ</div>
                <div class="info">
                    <p>🤖 Telegram-бот для поиска готовых домашних заданий</p>
                    <p>👨‍🎓 Для учеников 7-9 классов</p>
                    <p>📱 Удобный интерфейс с Mini App</p>
                    <p>⭐ Сохранение избранных предметов</p>
                </div>
                <a href="https://t.me/gdz_navigator_bot" class="telegram-btn" target="_blank">
                    🔗 Перейти в Telegram-бота
                </a>
                <div class="footer">
                    <p>Сервер активен с: """ + time.strftime("%d.%m.%Y %H:%M:%S") + """</p>
                    <p>🔄 Uptime проверяется каждые 5 минут</p>
                </div>
            </div>
        </body>
        </html>
        """
    
    @app.route('/health')
    def health():
        return 'OK', 200
    
    def run_flask():
        port = int(os.environ.get('PORT', 8080))
        app.run(host='0.0.0.0', port=port, debug=False)
    
    def keep_alive():
        t = Thread(target=run_flask, daemon=True)
        t.start()
        logger.info(f"🌐 Keep-alive сервер запущен на порту {os.environ.get('PORT', 8080)}")
    
    USE_KEEP_ALIVE = True
except ImportError as e:
    logger.warning(f"⚠️ Flask не установлен: {e}")
    USE_KEEP_ALIVE = False
    print("ℹ️ Запуск без веб-интерфейса")

# =================== ОСНОВНЫЕ ФУНКЦИИ БОТА ===================

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Обработчик команды /start"""
    user = update.effective_user
    welcome_text = f"""
📚 *Привет, {user.first_name}!*

Я - *ГДЗ Навигатор Бот* 🤖
Помогу найти готовые домашние задания для 7-9 классов.

*Для большего функционала используйте наш Mini App прямо здесь:*
• Удобный интерфейс
• Поиск по всем предметам
• Сохранение избранного
• Смена классов в один клик

*Доступные команды:*
/start - Главное меню
/classes - Выбрать класс
/favorites - Избранное
/app - Открыть Mini App прямо здесь
/webapp - Открыть Web версию
/help - Помощь

Нажмите "📱 Mini App" для полного функционала в Telegram!
    """
    
    # Создаем WebApp кнопку для открытия Mini App
    web_app_button = InlineKeyboardButton(
        "📱 Открыть Mini App", 
        web_app=WebAppInfo(url=WEB_APP_URL)
    )
    
    keyboard = [
        [
            InlineKeyboardButton("7 класс", callback_data="class_7"),
            InlineKeyboardButton("8 класс", callback_data="class_8"),
            InlineKeyboardButton("9 класс", callback_data="class_9")
        ],
        [
            web_app_button,
            InlineKeyboardButton("⭐ Избранное", callback_data="favorites")
        ],
        [
            InlineKeyboardButton("🌐 Web версия", url=WEB_APP_URL),
            InlineKeyboardButton("ℹ️ Помощь", callback_data="help")
        ]
    ]
    
    reply_markup = InlineKeyboardMarkup(keyboard)
    
    if update.message:
        await update.message.reply_text(
            welcome_text,
            reply_markup=reply_markup,
            parse_mode=ParseMode.MARKDOWN
        )
    else:
        await update.callback_query.edit_message_text(
            welcome_text,
            reply_markup=reply_markup,
            parse_mode=ParseMode.MARKDOWN
        )

async def app_command(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Открыть Mini App прямо в Telegram"""
    app_text = """
🚀 *Открываем Mini App...*

Нажмите кнопку ниже, чтобы открыть полную версию ГДЗ Навигатора прямо в Telegram!

*В Mini App доступно:*
✅ Удобный интерфейс с поиском
✅ Все предметы 7-9 классов
✅ Сохранение избранного
✅ Быстрая навигация

*Кнопка ниже откроет приложение прямо в Telegram!*
    """
    
    web_app_button = InlineKeyboardButton(
        "🎯 Открыть Mini App в Telegram", 
        web_app=WebAppInfo(url=WEB_APP_URL)
    )
    
    keyboard = [
        [web_app_button],
        [
            InlineKeyboardButton("🌐 Открыть в браузере", url=WEB_APP_URL),
            InlineKeyboardButton("◀️ Назад", callback_data="back_to_main")
        ]
    ]
    
    reply_markup = InlineKeyboardMarkup(keyboard)
    
    if update.message:
        await update.message.reply_text(
            app_text,
            reply_markup=reply_markup,
            parse_mode=ParseMode.MARKDOWN
        )
    else:
        await update.callback_query.edit_message_text(
            app_text,
            reply_markup=reply_markup,
            parse_mode=ParseMode.MARKDOWN
        )

async def webapp_command(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Открыть Web версию приложения"""
    webapp_text = f"""
🌐 *Web версия ГДЗ Навигатора*

Откройте полную версию в браузере:

{WEB_APP_URL}

*Доступно в Web версии:*
• Полнофункциональный поиск
• Все предметы и классы
• Сохранение избранного
• Удобный интерфейс

*Для лучшего опыта в Telegram используйте Mini App через кнопку в меню!*
    """
    
    keyboard = [
        [InlineKeyboardButton("🌐 Открыть в браузере", url=WEB_APP_URL)],
        [
            InlineKeyboardButton("📱 Mini App в Telegram", callback_data="open_miniapp"),
            InlineKeyboardButton("◀️ Назад", callback_data="back_to_main")
        ]
    ]
    
    reply_markup = InlineKeyboardMarkup(keyboard)
    
    if update.message:
        await update.message.reply_text(
            webapp_text,
            reply_markup=reply_markup,
            parse_mode=ParseMode.MARKDOWN
        )
    else:
        await update.callback_query.edit_message_text(
            webapp_text,
            reply_markup=reply_markup,
            parse_mode=ParseMode.MARKDOWN
        )

async def help_command(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Обработчик команды /help"""
    help_text = f"""
*Помощь по использованию бота*

*Доступны две версии:*
1. *Бот* - быстрый доступ к основным предметам
2. *Mini App* - полная версия с поиском в Telegram

*Как пользоваться ботом:*
1. Выберите класс через меню
2. Выберите предмет
3. Получите ссылку на ГДЗ
4. Добавьте в избранное

*Для полного функционала:*
• Поиск по всем предметам
• Удобная навигация
• Сохранение настроек
Используйте *Mini App* через кнопку ниже!

*Команды:*
/start - Главное меню
/classes - Выбрать класс
/favorites - Избранное
/app - Открыть Mini App в Telegram
/webapp - Открыть Web версию
/help - Эта справка
    """
    
    web_app_button = InlineKeyboardButton(
        "📱 Открыть Mini App в Telegram", 
        web_app=WebAppInfo(url=WEB_APP_URL)
    )
    
    keyboard = [
        [web_app_button],
        [
            InlineKeyboardButton("🌐 Web версия", url=WEB_APP_URL),
            InlineKeyboardButton("◀️ Назад", callback_data="back_to_main")
        ]
    ]
    
    reply_markup = InlineKeyboardMarkup(keyboard)
    
    if update.message:
        await update.message.reply_text(
            help_text,
            reply_markup=reply_markup,
            parse_mode=ParseMode.MARKDOWN
        )
    else:
        await update.callback_query.edit_message_text(
            help_text,
            reply_markup=reply_markup,
            parse_mode=ParseMode.MARKDOWN
        )

async def show_classes(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Показать выбор классов"""
    web_app_button = InlineKeyboardButton(
        "📱 Mini App", 
        web_app=WebAppInfo(url=WEB_APP_URL)
    )
    
    keyboard = [
        [
            InlineKeyboardButton("7 класс", callback_data="class_7"),
            InlineKeyboardButton("8 класс", callback_data="class_8"),
            InlineKeyboardButton("9 класс", callback_data="class_9")
        ],
        [
            web_app_button,
            InlineKeyboardButton("⭐ Избранное", callback_data="favorites")
        ],
        [InlineKeyboardButton("◀️ Назад", callback_data="back_to_main")]
    ]
    
    reply_markup = InlineKeyboardMarkup(keyboard)
    
    text = "📚 *Выберите класс:*\n\nДля поиска и расширенного функционала откройте *Mini App*!"
    
    if update.message:
        await update.message.reply_text(
            text,
            reply_markup=reply_markup,
            parse_mode=ParseMode.MARKDOWN
        )
    else:
        await update.callback_query.edit_message_text(
            text,
            reply_markup=reply_markup,
            parse_mode=ParseMode.MARKDOWN
        )

async def show_class_subjects(update: Update, context: ContextTypes.DEFAULT_TYPE, class_num: str) -> None:
    """Показать предметы для выбранного класса"""
    query = update.callback_query
    await query.answer()
    
    subjects = SUBJECTS_DATA.get(class_num, [])
    user_id = str(query.from_user.id)
    
    if not subjects:
        await query.edit_message_text(
            f"📭 Для {class_num} класса пока нет предметов.",
            reply_markup=InlineKeyboardMarkup([[InlineKeyboardButton("◀️ Назад", callback_data="classes")]])
        )
        return
    
    keyboard = []
    for subject in subjects:
        is_favorite = False
        if user_id in user_favorites:
            is_favorite = any(fav['url'] == subject['url'] for fav in user_favorites[user_id])
        
        button_text = f"{subject['icon']} {subject['name']}"
        if is_favorite:
            button_text = f"⭐ {button_text}"
        
        keyboard.append([
            InlineKeyboardButton(
                button_text, 
                callback_data=f"subject_{class_num}_{subjects.index(subject)}"
            )
        ])
    
    web_app_button = InlineKeyboardButton(
        "📱 Mini App", 
        web_app=WebAppInfo(url=WEB_APP_URL)
    )
    
    keyboard.append([
        web_app_button,
        InlineKeyboardButton("⭐ Избранное", callback_data="favorites")
    ])
    keyboard.append([InlineKeyboardButton("◀️ Назад", callback_data="classes")])
    
    reply_markup = InlineKeyboardMarkup(keyboard)
    
    text = f"📖 *{class_num} класс*\nВыберите предмет:\n\n*Для поиска используйте Mini App!*"
    
    await query.edit_message_text(
        text,
        reply_markup=reply_markup,
        parse_mode=ParseMode.MARKDOWN
    )

async def show_subject_info(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Показать информацию о предмете и ссылку"""
    query = update.callback_query
    await query.answer()
    
    data = query.data.split("_")
    class_num = data[1]
    subject_index = int(data[2])
    
    subject = SUBJECTS_DATA[class_num][subject_index]
    user_id = str(query.from_user.id)
    
    is_favorite = False
    if user_id in user_favorites:
        is_favorite = any(fav['url'] == subject['url'] for fav in user_favorites[user_id])
    
    text = f"""
{subject['icon']} *{subject['name']}*

*Автор:* {subject['author']}
*Класс:* {class_num}

[Ссылка на ГДЗ]({subject['url']})

💡 *Хотите больше функций?*
Откройте *Mini App* для поиска и удобной навигации прямо в Telegram!
    """
    
    keyboard = []
    
    favorite_text = "❌ Удалить из избранного" if is_favorite else "⭐ Добавить в избранное"
    favorite_callback = f"remove_fav_{class_num}_{subject_index}" if is_favorite else f"add_fav_{class_num}_{subject_index}"
    keyboard.append([InlineKeyboardButton(favorite_text, callback_data=favorite_callback)])
    
    keyboard.append([InlineKeyboardButton("🔗 Открыть ГДЗ", url=subject['url'])])
    
    web_app_button = InlineKeyboardButton(
        "📱 Открыть Mini App", 
        web_app=WebAppInfo(url=WEB_APP_URL)
    )
    keyboard.append([web_app_button])
    
    keyboard.append([
        InlineKeyboardButton("◀️ Назад к предметам", callback_data=f"class_{class_num}"),
        InlineKeyboardButton("🏠 Главная", callback_data="back_to_main")
    ])
    
    reply_markup = InlineKeyboardMarkup(keyboard)
    
    await query.edit_message_text(
        text,
        reply_markup=reply_markup,
        parse_mode=ParseMode.MARKDOWN,
        disable_web_page_preview=True
    )

async def add_to_favorites(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Добавить предмет в избранное"""
    query = update.callback_query
    await query.answer("✅ Добавлено в избранное!")
    
    data = query.data.split("_")
    class_num = data[2]
    subject_index = int(data[3])
    
    subject = SUBJECTS_DATA[class_num][subject_index]
    user_id = str(query.from_user.id)
    
    if user_id not in user_favorites:
        user_favorites[user_id] = []
    
    if not any(fav['url'] == subject['url'] for fav in user_favorites[user_id]):
        subject_with_class = subject.copy()
        subject_with_class['class'] = class_num
        user_favorites[user_id].append(subject_with_class)
        logger.info(f"Пользователь {user_id} добавил в избранное: {subject['name']}")
    
    await show_subject_info(update, context)

async def remove_from_favorites(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Удалить предмет из избранного"""
    query = update.callback_query
    await query.answer("❌ Удалено из избранного!")
    
    data = query.data.split("_")
    class_num = data[2]
    subject_index = int(data[3])
    
    subject = SUBJECTS_DATA[class_num][subject_index]
    user_id = str(query.from_user.id)
    
    if user_id in user_favorites:
        user_favorites[user_id] = [fav for fav in user_favorites[user_id] if fav['url'] != subject['url']]
        logger.info(f"Пользователь {user_id} удалил из избранного: {subject['name']}")
    
    await show_subject_info(update, context)

async def show_favorites(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Показать избранные предметы пользователя"""
    user_id = str(update.effective_user.id)
    
    if user_id not in user_favorites or not user_favorites[user_id]:
        text = """
⭐ *Избранное*

У вас пока нет избранных предметов.

💡 *Совет:*
Добавляйте предметы в избранное для быстрого доступа!
А еще больше функций в нашем *Mini App* прямо в Telegram!
        """
        
        web_app_button = InlineKeyboardButton(
            "📱 Открыть Mini App", 
            web_app=WebAppInfo(url=WEB_APP_URL)
        )
        
        keyboard = [
            [web_app_button],
            [InlineKeyboardButton("◀️ Назад", callback_data="back_to_main")]
        ]
    else:
        text = "⭐ *Ваше избранное:*\n\n"
        keyboard = []
        
        for i, subject in enumerate(user_favorites[user_id][:10]):
            text += f"{subject['icon']} *{subject['name']}*\n"
            text += f"Автор: {subject['author']} | Класс: {subject['class']}\n"
            text += f"[Ссылка]({subject['url']})\n\n"
            
            subjects = SUBJECTS_DATA.get(subject['class'], [])
            for idx, subj in enumerate(subjects):
                if subj['url'] == subject['url']:
                    keyboard.append([
                        InlineKeyboardButton(
                            f"{subject['icon']} {subject['name']}",
                            callback_data=f"subject_{subject['class']}_{idx}"
                        )
                    ])
                    break
        
        text += "\n💡 *Еще больше функций в Mini App прямо в Telegram!*"
        
        web_app_button = InlineKeyboardButton(
            "📱 Открыть Mini App", 
            web_app=WebAppInfo(url=WEB_APP_URL)
        )
        
        keyboard.append([InlineKeyboardButton("🗑️ Очистить избранное", callback_data="clear_favorites")])
        keyboard.append([web_app_button])
    
    keyboard.append([InlineKeyboardButton("◀️ Назад", callback_data="back_to_main")])
    
    reply_markup = InlineKeyboardMarkup(keyboard)
    
    if update.callback_query:
        await update.callback_query.edit_message_text(
            text,
            reply_markup=reply_markup,
            parse_mode=ParseMode.MARKDOWN,
            disable_web_page_preview=True
        )
    else:
        await update.message.reply_text(
            text,
            reply_markup=reply_markup,
            parse_mode=ParseMode.MARKDOWN,
            disable_web_page_preview=True
        )

async def clear_favorites(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Очистить все избранное"""
    query = update.callback_query
    await query.answer()
    
    user_id = str(query.from_user.id)
    
    if user_id in user_favorites:
        user_favorites[user_id] = []
        await query.answer("✅ Избранное очищено!")
        logger.info(f"Пользователь {user_id} очистил избранное")
    
    await show_favorites(update, context)

async def open_miniapp(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Открыть Mini App через callback"""
    await app_command(update, context)

async def handle_text(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Обработчик текстовых сообщений"""
    text = update.message.text.lower()
    
    if text in ["привет", "начать", "старт", "start", "hello", "hi"]:
        await start(update, context)
    elif text in ["помощь", "help", "справка"]:
        await help_command(update, context)
    elif text in ["miniapp", "мини апп", "приложение", "app", "минияпп"]:
        await app_command(update, context)
    elif text in ["webapp", "веб", "сайт", "web", "сайт", "браузер"]:
        await webapp_command(update, context)
    elif text in ["классы", "предметы", "classes", "уроки", "гдз"]:
        await show_classes(update, context)
    elif text in ["избранное", "favorites", "fav", "любимые", "закладки"]:
        await show_favorites(update, context)
    elif text in ["статус", "status", "работа", "бот"]:
        await update.message.reply_text(
            "✅ *Бот работает нормально!*\n\n"
            f"🤖 Версия: ГДЗ Навигатор 1.0\n"
            f"📚 Классы: 7-9\n"
            f"📱 Mini App: {WEB_APP_URL}\n"
            f"⭐ Избранное: {len(user_favorites.get(str(update.effective_user.id), []))} предметов\n\n"
            "Используйте команду /help для списка команд.",
            parse_mode=ParseMode.MARKDOWN
        )
    else:
        reply_text = """
🤔 Не совсем понимаю ваш запрос.

*Попробуйте:*
• Выбрать класс через меню
• Открыть *Mini App* для поиска прямо в Telegram
• Использовать команду /help

*Или напишите:* привет, помощь, miniapp, статус
        """
        
        web_app_button = InlineKeyboardButton(
            "📱 Открыть Mini App", 
            web_app=WebAppInfo(url=WEB_APP_URL)
        )
        
        keyboard = [
            [web_app_button],
            [
                InlineKeyboardButton("📚 Выбрать класс", callback_data="classes"),
                InlineKeyboardButton("ℹ️ Помощь", callback_data="help")
            ]
        ]
        
        reply_markup = InlineKeyboardMarkup(keyboard)
        
        await update.message.reply_text(
            reply_text,
            reply_markup=reply_markup,
            parse_mode=ParseMode.MARKDOWN
        )

async def button_callback(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Обработчик нажатий на inline кнопки"""
    query = update.callback_query
    data = query.data
    
    if data == "back_to_main":
        await start(update, context)
    elif data == "classes":
        await show_classes(update, context)
    elif data.startswith("class_"):
        class_num = data.split("_")[1]
        await show_class_subjects(update, context, class_num)
    elif data.startswith("subject_"):
        await show_subject_info(update, context)
    elif data.startswith("add_fav_"):
        await add_to_favorites(update, context)
    elif data.startswith("remove_fav_"):
        await remove_from_favorites(update, context)
    elif data == "favorites":
        await show_favorites(update, context)
    elif data == "open_miniapp":
        await open_miniapp(update, context)
    elif data == "clear_favorites":
        await clear_favorites(update, context)
    elif data == "help":
        await help_command(update, context)
    elif data == "back":
        await show_classes(update, context)

# =================== ОБРАБОТКА ОШИБОК ===================

async def error_handler(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Обработчик ошибок"""
    logger.error(msg="Exception while handling an update:", exc_info=context.error)
    
    # Отправляем сообщение пользователю
    try:
        error_text = "⚠️ *Произошла ошибка*\n\nПопробуйте еще раз или используйте команду /start"
        
        if update and update.effective_chat:
            await context.bot.send_message(
                chat_id=update.effective_chat.id,
                text=error_text,
                parse_mode=ParseMode.MARKDOWN
            )
    except Exception as e:
        logger.error(f"Ошибка при отправке сообщения об ошибке: {e}")

# =================== ЗАПУСК БОТА ===================

def run_bot():
    """Запуск Telegram бота"""
    # Получаем токен из переменных окружения Replit
    TOKEN = os.environ.get("BOT_TOKEN")
    
    if not TOKEN:
        logger.error("❌ Токен бота не найден!")
        logger.error("📝 Создайте переменную окружения BOT_TOKEN в Secrets Replit")
        logger.error("📝 Инструкция: Secrets → New Secret")
        logger.error("📝 Ключ: BOT_TOKEN, Значение: ваш_токен_бота")
        print("=" * 50)
        print("❌ ОШИБКА: Токен бота не найден!")
        print("👉 Создайте переменную окружения BOT_TOKEN в Replit Secrets")
        print("👉 Перейдите в Tools → Secrets → Add new secret")
        print("👉 Key: BOT_TOKEN, Value: ваш_токен_бота")
        print("=" * 50)
        return
    
    try:
        # Запускаем keep-alive сервер для Replit
        if USE_KEEP_ALIVE:
            keep_alive()
            print("✅ Keep-alive сервер запущен")
        
        # Создаем приложение
        application = Application.builder().token(TOKEN).build()
        
        # Добавляем обработчик ошибок
        application.add_error_handler(error_handler)
        
        # Регистрируем обработчики команд
        application.add_handler(CommandHandler("start", start))
        application.add_handler(CommandHandler("help", help_command))
        application.add_handler(CommandHandler("classes", show_classes))
        application.add_handler(CommandHandler("favorites", show_favorites))
        application.add_handler(CommandHandler("app", app_command))
        application.add_handler(CommandHandler("miniapp", app_command))
        application.add_handler(CommandHandler("webapp", webapp_command))
        application.add_handler(CommandHandler("web", webapp_command))
        application.add_handler(CommandHandler("status", lambda u, c: u.message.reply_text("✅ Бот работает!")))
        
        # Регистрируем обработчики callback запросов
        application.add_handler(CallbackQueryHandler(button_callback))
        
        # Регистрируем обработчик текстовых сообщений
        application.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, handle_text))
        
        # Запускаем бота
        print("=" * 50)
        print("🎉 ГДЗ Навигатор Бот запущен!")
        print(f"🤖 Токен: {TOKEN[:10]}...")
        print(f"👤 Бот: @{application.bot.username}")
        print(f"📱 Mini App URL: {WEB_APP_URL}")
        print(f"🌐 Keep-alive: {'Включен' if USE_KEEP_ALIVE else 'Выключен'}")
        print("=" * 50)
        print("✅ Бот готов к работе!")
        print("👉 Отправьте /start в Telegram")
        print("👉 Веб-страница доступна по URL Replit")
        print("=" * 50)
        
        # Запускаем polling
        application.run_polling(allowed_updates=Update.ALL_TYPES, drop_pending_updates=True)
        
    except Exception as e:
        logger.error(f"❌ Ошибка при запуске бота: {e}")
        print(f"\n🔧 Детали ошибки: {e}")
        print("\n🔧 Советы по устранению:")
        print("1. Проверьте токен бота в Secrets")
        print("2. Установите зависимости: pip install -r requirements.txt")
        print("3. Проверьте интернет-подключение")
        print("4. Убедитесь, что бот создан через @BotFather")
        print("5. Проверьте логи в консоли Replit")

# =================== ГЛАВНЫЙ БЛОК ===================

if __name__ == "__main__":
    print("=" * 50)
    print("🤖 Запуск ГДЗ Навигатор Бота...")
    print("📚 Версия 1.0 (Оптимизировано для Replit)")
    print("👨‍💻 Разработчик: GDZ Navigator Team")
    print("=" * 50)
    
    # Проверяем наличие токена
    TOKEN = os.environ.get("BOT_TOKEN")
    if not TOKEN:
        print("⚠️ ВНИМАНИЕ: BOT_TOKEN не найден в переменных окружения!")
        print("\n📝 Как исправить в Replit:")
        print("1. Нажмите на иконку 🔒 'Secrets' слева")
        print("2. Нажмите 'Add a new secret'")
        print("3. В поле Key введите: BOT_TOKEN")
        print("4. В поле Value введите ваш токен бота")
        print("5. Нажмите 'Add secret'")
        print("6. Перезапустите Repl (Stop → Run)")
        print("\n🔑 Ваш токен должен начинаться с: 8456034289...")
        print("=" * 50)
    
    # Запускаем бота
    run_bot()
