import { Controller, Get, Post, Body } from '@nestjs/common';
import { CreateWeatherLogDto } from '../dtos/create-weather-log.dto';
import { CreateWeatherLogUseCase } from '../../application/use-cases/create-weather-log.use-case';
import { GetWeatherLogsUseCase } from '../../application/use-cases/get-weather-logs.use-case';
import { GenerateInsightsUseCase } from '../../application/use-cases/generate-insights.use-case';
import { WeatherLog } from '../../domain/entities/weather-log.entity';

@Controller('weather')
export class WeatherController {
}
}
