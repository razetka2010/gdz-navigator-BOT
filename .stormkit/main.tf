
terraform {
  required_providers {
    stormkit = {
      source = "stormkit-io/stormkit"
    }
  }
}

provider "stormkit" {
  # Токен будет установлен через переменные окружения
}

resource "stormkit_application" "gdz_bot" {
  name        = "gdz-navigator-bot"
  description = "Telegram bot for GDZ 7-9 grades"
  region      = "europe-west1"
  
  environment_variables = {
    BOT_TOKEN   = var.bot_token
    WEB_APP_URL = "https://razetka2010.github.io/gdz-navigator/"
    PORT        = "8080"
  }
}
