import httpx
import logging
from datetime import datetime, timezone
from ..domain.entities import WeatherData
from ..domain.interfaces import WeatherSource
from .config import Config

logger = logging.getLogger(__name__)

class OpenMeteoClient(WeatherSource):
    def get_weather(self) -> WeatherData | None:
        url = "https://api.open-meteo.com/v1/forecast"
        params = {
            "latitude": Config.CITY_LAT,
            "longitude": Config.CITY_LON,
            "current": "temperature_2m,relative_humidity_2m,cloud_cover,wind_speed_10m,shortwave_radiation,direct_normal_irradiance,diffuse_radiation,global_tilted_irradiance,sunshine_duration,weather_code",
            "timezone": "auto",
            "tilt": 25,
            "azimuth": 180
        }

        try:
            with httpx.Client() as client:
                response = client.get(url, params=params, timeout=10.0)
                response.raise_for_status()
                data = response.json()
                
                current = data.get("current", {})
                
                weather = WeatherData(
                    latitude=data.get("latitude"),
                    longitude=data.get("longitude"),
                    timestamp=datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
                    temperature=current.get("temperature_2m"),
                    humidity=current.get("relative_humidity_2m"),
                    wind_speed=current.get("wind_speed_10m"),
                    cloud_cover=current.get("cloud_cover"),
                    shortwave_radiation=current.get("shortwave_radiation", 0.0),
                    direct_normal_irradiance=current.get("direct_normal_irradiance", 0.0),
                    diffuse_radiation=current.get("diffuse_radiation", 0.0),
                    global_tilted_irradiance=current.get("global_tilted_irradiance", 0.0),
                    sunshine_duration=current.get("sunshine_duration", 0.0),
                    condition=str(current.get("weather_code"))
                )
                
                return weather
                
        except Exception as e:
            logger.error(f"Error fetching weather data: {e}")
            return None
