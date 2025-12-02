import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    RABBITMQ_HOST = os.getenv("RABBITMQ_HOST", "localhost")
    RABBITMQ_PORT = int(os.getenv("RABBITMQ_PORT", 5672))
    RABBITMQ_USER = os.getenv("RABBITMQ_USER", "user")
    RABBITMQ_PASS = os.getenv("RABBITMQ_PASS", "password")
    QUEUE_NAME = "weather_data"
    CITY_LAT = -23.5505
    CITY_LON = -46.6333
