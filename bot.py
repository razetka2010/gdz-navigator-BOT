# bot.py
import os
import logging
import sys
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup, WebAppInfo
from telegram.ext import Application, CommandHandler, CallbackQueryHandler, MessageHandler, filters, ContextTypes
from telegram.constants import ParseMode

# Настройка логирования
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO,
    stream=sys.stdout  # Важно для Render
)
logger = logging.getLogger(__name__)

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

# URL вашего Mini App
WEB_APP_URL = "https://razetka2010.github.io/gdz-navigator/"

# Хранилище для избранного (в памяти)
user_favorites = {}

# Команда /start
async def start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Обработчик команды /start"""
    user = update.effective_user
    welcome_text = f"""
📚 Привет, {user.first_name}!

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
/app - Открыть Mini App
/help - Помощь
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

# Команда /app
async def app_command(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Открыть Mini App"""
    app_text = """
🚀 *Открываем Mini App...*

Нажмите кнопку ниже, чтобы открыть полную версию ГДЗ Навигатора!

*В Mini App доступно:*
✅ Удобный интерфейс с поиском
✅ Все предметы 7-9 классов
✅ Сохранение избранного
✅ Быстрая навигация
    """
    
    web_app_button = InlineKeyboardButton(
        "🎯 Открыть Mini App", 
        web_app=WebAppInfo(url=WEB_APP_URL)
    )
    
    keyboard = [
        [web_app_button],
        [
            InlineKeyboardButton("🌐 В браузере", url=WEB_APP_URL),
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

# Команда /help
async def help_command(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Обработчик команды /help"""
    help_text = f"""
*Помощь по использованию бота*

*Как пользоваться:*
1. Выберите класс через меню
2. Выберите предмет
3. Получите ссылку на ГДЗ
4. Добавьте в избранное

*Команды:*
/start - Главное меню
/classes - Выбрать класс
/favorites - Избранное
/app - Открыть Mini App
/help - Эта справка
    """
    
    web_app_button = InlineKeyboardButton(
        "📱 Открыть Mini App", 
        web_app=WebAppInfo(url=WEB_APP_URL)
    )
    
    keyboard = [
        [web_app_button],
        [
            InlineKeyboardButton("📚 Классы", callback_data="classes"),
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

# Команда /classes
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
    
    text = "📚 *Выберите класс:*"
    
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

# Показать предметы класса
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
    
    # Создаем клавиатуру с предметами
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
    
    # Добавляем кнопки навигации
    keyboard.append([
        InlineKeyboardButton("📱 Mini App", web_app=WebAppInfo(url=WEB_APP_URL)),
        InlineKeyboardButton("⭐ Избранное", callback_data="favorites")
    ])
    keyboard.append([InlineKeyboardButton("◀️ Назад", callback_data="classes")])
    
    reply_markup = InlineKeyboardMarkup(keyboard)
    
    text = f"📖 *{class_num} класс*\nВыберите предмет:"
    
    await query.edit_message_text(
        text,
        reply_markup=reply_markup,
        parse_mode=ParseMode.MARKDOWN
    )

# Показать информацию о предмете
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
    """
    
    keyboard = []
    
    favorite_text = "❌ Удалить из избранного" if is_favorite else "⭐ Добавить в избранное"
    favorite_callback = f"remove_fav_{class_num}_{subject_index}" if is_favorite else f"add_fav_{class_num}_{subject_index}"
    keyboard.append([InlineKeyboardButton(favorite_text, callback_data=favorite_callback)])
    
    keyboard.append([InlineKeyboardButton("🔗 Открыть ГДЗ", url=subject['url'])])
    
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

# Добавить в избранное
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
    
    await show_subject_info(update, context)

# Удалить из избранного
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
    
    await show_subject_info(update, context)

# Показать избранное
async def show_favorites(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Показать избранные предметы пользователя"""
    user_id = str(update.effective_user.id)
    
    if user_id not in user_favorites or not user_favorites[user_id]:
        text = """
⭐ *Избранное*

У вас пока нет избранных предметов.

*Совет:*
Добавляйте предметы в избранное для быстрого доступа!
        """
        
        keyboard = [
            [InlineKeyboardButton("📱 Mini App", web_app=WebAppInfo(url=WEB_APP_URL))],
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
        
        keyboard.append([InlineKeyboardButton("🗑️ Очистить избранное", callback_data="clear_favorites")])
        keyboard.append([InlineKeyboardButton("📱 Mini App", web_app=WebAppInfo(url=WEB_APP_URL))])
    
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

# Очистить избранное
async def clear_favorites(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Очистить все избранное"""
    query = update.callback_query
    await query.answer()
    
    user_id = str(query.from_user.id)
    
    if user_id in user_favorites:
        user_favorites[user_id] = []
        await query.answer("✅ Избранное очищено!")
    
    await show_favorites(update, context)

# Обработчик текстовых сообщений
async def handle_text(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Обработчик текстовых сообщений"""
    text = update.message.text.lower()
    
    if text in ["привет", "начать", "старт", "start"]:
        await start(update, context)
    elif text in ["помощь", "help"]:
        await help_command(update, context)
    elif text in ["miniapp", "мини апп", "приложение", "app"]:
        await app_command(update, context)
    elif text in ["классы", "предметы", "classes"]:
        await show_classes(update, context)
    elif text in ["избранное", "favorites", "fav"]:
        await show_favorites(update, context)
    else:
        reply_text = """
🤔 Не совсем понимаю ваш запрос.

*Попробуйте:*
• Выбрать класс через меню
• Открыть *Mini App* для поиска
• Использовать команду /help
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

# Обработчик callback запросов
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
    elif data == "clear_favorites":
        await clear_favorites(update, context)
    elif data == "help":
        await help_command(update, context)

# Главная функция
def main() -> None:
    """Запуск бота"""
    # Получаем токен из переменных окружения
    TOKEN = os.environ.get("BOT_TOKEN")
    
    if not TOKEN:
        logger.error("❌ Ошибка: Токен бота не найден!")
        logger.error("📝 Установите переменную окружения BOT_TOKEN на Render.com")
        print("=" * 50)
        print("❌ ОШИБКА: Токен бота не найден!")
        print("📝 На Render.com добавьте переменную окружения:")
        print("   Key: BOT_TOKEN")
        print("   Value: ваш_токен_бота")
        print("=" * 50)
        return
    
    # Проверяем URL Mini App
    if WEB_APP_URL == "https://ваш-mini-app-url.com":
        logger.warning("⚠️ Укажите реальный URL вашего Mini App!")
    
    try:
        # Создаем приложение
        application = Application.builder().token(TOKEN).build()
        
        # Регистрируем обработчики команд
        application.add_handler(CommandHandler("start", start))
        application.add_handler(CommandHandler("help", help_command))
        application.add_handler(CommandHandler("classes", show_classes))
        application.add_handler(CommandHandler("favorites", show_favorites))
        application.add_handler(CommandHandler("app", app_command))
        application.add_handler(CommandHandler("miniapp", app_command))
        
        # Регистрируем обработчики callback запросов
        application.add_handler(CallbackQueryHandler(button_callback))
        
        # Регистрируем обработчик текстовых сообщений
        application.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, handle_text))
        
        # Запускаем бота
        print("=" * 50)
        print("🎉 ГДЗ Навигатор Бот запускается...")
        print(f"🤖 Используется токен: {TOKEN[:10]}...")
        print(f"📱 Mini App URL: {WEB_APP_URL}")
        print("=" * 50)
        print("✅ Бот готов к работе на Render.com!")
        print("👉 Отправьте /start в Telegram")
        print("=" * 50)
        
        # Важно для Render: запускаем polling
        application.run_polling(
            allowed_updates=Update.ALL_TYPES,
            drop_pending_updates=True
        )
        
    except Exception as e:
        logger.error(f"❌ Ошибка при запуске бота: {e}")
        print(f"\n🔧 Детали ошибки: {e}")
        print("\n📝 Проверьте:")
        print("1. Правильность токена бота")
        print("2. Подключение к интернету")
        print("3. Доступность Telegram API")

# Запуск приложения
if __name__ == "__main__":
    main()
