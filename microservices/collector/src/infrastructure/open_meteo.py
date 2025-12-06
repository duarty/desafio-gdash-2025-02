import httpx
import logging
from datetime import datetime, timezone
from ..domain.entities import WeatherData
from ..domain.interfaces import WeatherSource
from .config import Config

logger = logging.getLogger(__name__)

class OpenMeteoClient(WeatherSource):
    def get_weather(self) -> WeatherData | None:
        url = Config.OPEN_METEO_URL
        params = {
            "latitude": Config.CITY_LAT,
            "longitude": Config.CITY_LON,
            "current": "temperature_2m,relative_humidity_2m,cloud_cover,wind_speed_10m,shortwave_radiation,direct_normal_irradiance,diffuse_radiation,global_tilted_irradiance,sunshine_duration,weather_code",
            "timezone": "auto",
            "tilt": Config.SOLAR_PANEL_TILT,
            "azimuth": Config.SOLAR_PANEL_AZIMUTH
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
                    condition=self._get_condition_text(current.get("weather_code"))
                )
                
                return weather
                
        except Exception as e:
            logger.error(f"Error fetching weather data: {e}")
            return None

    def _get_condition_text(self, code: int) -> str:
        if code is None:
            return "Unknown"
            
        mapping = {
            0: "Céu limpo",
            1: "Predominantemente limpo", 
            2: "Parcialmente nublado",
            3: "Encoberto",
            45: "Nevoeiro",
            48: "Nevoeiro com depósito de gelo",
            51: "Chuvisco leve",
            53: "Chuvisco moderado",
            55: "Chuvisco denso",
            56: "Chuvisco congelante leve",
            57: "Chuvisco congelante denso",
            61: "Chuva leve",
            63: "Chuva moderada",
            65: "Chuva forte",
            66: "Chuva congelante leve",
            67: "Chuva congelante forte",
            71: "Queda de neve leve",
            73: "Queda de neve moderada",
            75: "Queda de neve forte",
            77: "Grãos de neve",
            80: "Pancadas de chuva leves",
            81: "Pancadas de chuva moderadas",
            82: "Pancadas de chuva violentas",
            85: "Pancadas de neve leves",
            86: "Pancadas de neve fortes",
            95: "Tempestade",
            96: "Tempestade com granizo leve",
            99: "Tempestade com granizo forte"
        }
        return mapping.get(code, f"Desconhecido ({code})")
