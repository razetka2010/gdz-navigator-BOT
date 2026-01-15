#!/bin/bash

# Переходим в папку с ботом
cd /home/ваш_username/gdz_bot

# Останавливаем текущий процесс бота
pkill -f "python bot.py" 2>/dev/null
sleep 2

# Запускаем бота в фоновом режиме
python bot.py >> bot.log 2>&1 &

echo "✅ Бот перезапущен: $(date)" >> restart.log
