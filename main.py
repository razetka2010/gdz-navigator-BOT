# main.py - Главный файл для запуска на Stormkit
import os
import asyncio
from threading import Thread
from bot import app, run_bot, keep_alive  # Импортируем из вашего bot.py

def run_flask():
    """Запуск Flask сервера"""
    port = int(os.environ.get('PORT', 8080))
    print(f"🌐 Flask запущен на порту {port}")
    app.run(host='0.0.0.0', port=port, debug=False, use_reloader=False)

def run_telegram_bot():
    """Запуск Telegram бота"""
    print("🤖 Запуск Telegram бота...")
    run_bot()

if __name__ == "__main__":
    print("🚀 Запуск приложения на Stormkit...")
    
    # Запускаем Flask в отдельном потоке
    flask_thread = Thread(target=run_flask, daemon=True)
    flask_thread.start()
    
    # Запускаем Telegram бота в основном потоке
    run_telegram_bot()
