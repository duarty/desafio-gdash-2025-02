from pydantic import BaseModel
from typing import Optional

class WeatherData(BaseModel):
    latitude: float
    longitude: float
    timestamp: str
    temperature: float
    humidity: int
    wind_speed: float
    cloud_cover: int
    shortwave_radiation: float
    direct_normal_irradiance: float
    diffuse_radiation: float
    global_tilted_irradiance: float
    sunshine_duration: float
    condition: str
