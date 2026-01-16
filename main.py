# main.py - Главная точка входа для Stormkit.io
import os
import sys
import threading
import time
from flask import Flask

# Создаем простое Flask приложение для Stormkit
app = Flask(__name__)

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
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>📚 ГДЗ Навигатор Бот</h1>
            <div class="status">✅ БОТ ЗАПУЩЕН НА STORMKIT</div>
            <p>Telegram бот работает в фоновом режиме</p>
            <p>Для использования перейдите в Telegram</p>
            <a href="https://t.me/gdz_navigator_bot" class="telegram-btn" target="_blank">
                🔗 Перейти к боту
            </a>
        </div>
    </body>
    </html>
    """

@app.route('/health')
def health():
    """Health check endpoint для Stormkit"""
    return 'OK', 200

def run_flask():
    """Запуск Flask сервера"""
    port = int(os.environ.get('PORT', 8080))
    print(f"🌐 Запуск Flask на порту {port}")
    app.run(host='0.0.0.0', port=port, debug=False, use_reloader=False)

def run_telegram_bot():
    """Запуск Telegram бота"""
    try:
        # Импортируем и запускаем бота из bot.py
        from bot import run_bot
        print("🤖 Запуск Telegram бота...")
        run_bot()
    except ImportError as e:
        print(f"❌ Ошибка импорта бота: {e}")
    except Exception as e:
        print(f"❌ Ошибка бота: {e}")

def main():
    """Основная функция"""
    print("=" * 60)
    print("🚀 ГДЗ НАВИГАТОР БОТ - STORMKIT.IO")
    print("📚 Версия 2.0")
    print("=" * 60)
    
    # Проверяем токен
    token = os.environ.get("BOT_TOKEN")
    if not token:
        print("⚠️ ВНИМАНИЕ: BOT_TOKEN не найден!")
        print("   Бот не запустится, но Flask сервер будет работать")
    
    print(f"🌐 Web URL: https://healerweak-wqewfo.stormkit.dev")
    print(f"🤖 Бот: @gdz_navigator_bot")
    print(f"📱 Mini App: {os.environ.get('WEB_APP_URL', 'не установлен')}")
    print("=" * 60)
    
    # Запускаем Flask в отдельном потоке
    flask_thread = threading.Thread(target=run_flask, daemon=True)
    flask_thread.start()
    
    print("⏳ Ожидаем запуск Flask...")
    time.sleep(3)  # Даем время Flask запуститься
    
    print("✅ Flask сервер запущен")
    print("🤖 Запускаем Telegram бота...")
    
    # Запускаем Telegram бота в основном потоке
    try:
        run_telegram_bot()
    except KeyboardInterrupt:
        print("\n🛑 Бот остановлен пользователем")
    except Exception as e:
        print(f"❌ Критическая ошибка: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()
