from flask import Flask
from threading import Thread

app = Flask(__name__)

@app.route('/')
def home():
    return "🤖 ГДЗ Навигатор Бот работает!"

@app.route('/health')
def health():
    return "✅ OK"

@app.route('/status')
def status():
    try:
        with open('bot.log', 'r') as f:
            lines = f.readlines()[-10:]  # Последние 10 строк лога
        return "".join(lines)
    except:
        return "Лог недоступен"

def run_web():
    app.run(host='0.0.0.0', port=8080)

if __name__ == '__main__':
    run_web()
