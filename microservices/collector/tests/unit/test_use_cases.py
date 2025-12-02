import unittest
from unittest.mock import MagicMock
from src.domain.entities import WeatherData
from src.application.use_cases import CollectWeatherUseCase

class TestCollectWeatherUseCase(unittest.TestCase):
    def setUp(self):
        self.mock_source = MagicMock()
        self.mock_publisher = MagicMock()
        self.use_case = CollectWeatherUseCase(self.mock_source, self.mock_publisher)

    def test_execute_success(self):
        # Arrange
        mock_weather = WeatherData(
            latitude=0.0, longitude=0.0, timestamp="2023-01-01T00:00:00Z",
            temperature=25.0, humidity=50, wind_speed=10.0, cloud_cover=0,
            shortwave_radiation=100.0, direct_normal_irradiance=100.0,
            diffuse_radiation=50.0, global_tilted_irradiance=120.0,
            sunshine_duration=3600.0, condition="0"
        )
        self.mock_source.get_weather.return_value = mock_weather

        # Act
        self.use_case.execute()

        # Assert
        self.mock_source.get_weather.assert_called_once()
        self.mock_publisher.publish.assert_called_once_with(mock_weather)

    def test_execute_no_data(self):
        # Arrange
        self.mock_source.get_weather.return_value = None

        # Act
        self.use_case.execute()

        # Assert
        self.mock_source.get_weather.assert_called_once()
        self.mock_publisher.publish.assert_not_called()

if __name__ == '__main__':
    unittest.main()
