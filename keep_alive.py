# keep_alive.py
from flask import Flask
from threading import Thread
import logging

app = Flask('')

@app.route('/')
def home():
    return "🤖 Бот работает! Статус: ONLINE"

def run():
    app.run(host='0.0.0.0', port=8080)

def keep_alive():
    t = Thread(target=run)
    t.start()
