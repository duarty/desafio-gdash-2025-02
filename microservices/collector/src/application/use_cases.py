import logging
from ..domain.interfaces import WeatherSource, MessagePublisher

logger = logging.getLogger(__name__)

class CollectWeatherUseCase:
    def __init__(self, weather_source: WeatherSource, publisher: MessagePublisher):
        self.weather_source = weather_source
        self.publisher = publisher

    def execute(self):
        logger.info("Starting data collection job...")
        weather = self.weather_source.get_weather()
        if weather:
            self.publisher.publish(weather)
        else:
            logger.warning("No data to publish.")
