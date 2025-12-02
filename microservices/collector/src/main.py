import time
import schedule
import logging
from src.infrastructure.logging import setup_logging
from src.infrastructure.open_meteo import OpenMeteoClient
from src.infrastructure.rabbitmq import RabbitMQPublisher
from src.application.use_cases import CollectWeatherUseCase

logger = logging.getLogger(__name__)

def main():
    setup_logging()
    logger.info("Weather Collector Service Started 🚀")
    
    # Dependency Injection
    weather_source = OpenMeteoClient()
    publisher = RabbitMQPublisher()
    use_case = CollectWeatherUseCase(weather_source, publisher)
    
    # Job definition
    def job():
        use_case.execute()

    # Run immediately on startup
    job()
    
    # Schedule every 1 minute
    schedule.every(1).minutes.do(job)
    
    while True:
        schedule.run_pending()
        time.sleep(1)

if __name__ == "__main__":
    time.sleep(10) 
    main()
