from abc import ABC, abstractmethod
from .entities import WeatherData

class WeatherSource(ABC):
    @abstractmethod
    def get_weather(self) -> WeatherData | None:
        pass

class MessagePublisher(ABC):
    @abstractmethod
    def publish(self, data: WeatherData) -> None:
        pass
