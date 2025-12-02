import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    RABBITMQ_HOST = os.getenv("RABBITMQ_HOST", "localhost")
    RABBITMQ_PORT = int(os.getenv("RABBITMQ_PORT", 5672))
    RABBITMQ_USER = os.getenv("RABBITMQ_USER", "user")
    RABBITMQ_PASS = os.getenv("RABBITMQ_PASS", "password")
    QUEUE_NAME = "weather_data"
    CITY_LAT = float(os.getenv("CITY_LAT", 2.8235))
    CITY_LON = float(os.getenv("CITY_LON", -60.6758))
    OPEN_METEO_URL = os.getenv("OPEN_METEO_URL", "https://api.open-meteo.com/v1/forecast")
    SOLAR_PANEL_TILT = int(os.getenv("SOLAR_PANEL_TILT", 25))
    SOLAR_PANEL_AZIMUTH = int(os.getenv("SOLAR_PANEL_AZIMUTH", 180))
    COLLECTOR_SCHEDULE_MINUTES = int(os.getenv("COLLECTOR_SCHEDULE_MINUTES", 1))
