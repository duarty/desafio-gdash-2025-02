import time
import schedule
import logging
from src.infrastructure.logging import setup_logging
from src.infrastructure.open_meteo import OpenMeteoClient
from src.infrastructure.rabbitmq import RabbitMQPublisher
from src.application.use_cases import CollectWeatherUseCase
from src.infrastructure.config import Config

logger = logging.getLogger(__name__)

def main():
    setup_logging()
    logger.info("Weather Collector Service Started 🚀")
    
    weather_source = OpenMeteoClient()
    publisher = RabbitMQPublisher()
    use_case = CollectWeatherUseCase(weather_source, publisher)
    
    def job():
        use_case.execute()

    job()
    
    schedule.every(Config.COLLECTOR_SCHEDULE_MINUTES).minutes.do(job)
    
    while True:
        schedule.run_pending()
        time.sleep(1)

if __name__ == "__main__":
    time.sleep(10) 
    main()
