import { Controller, Get, Post, Body } from "@nestjs/common";
import { CreateWeatherLogDto } from "../dtos/create-weather-log.dto";
import { CreateWeatherLogUseCase } from "../../application/use-cases/create-weather-log.use-case";
import { GetWeatherLogsUseCase } from "../../application/use-cases/get-weather-logs.use-case";
import { GenerateInsightsUseCase } from "../../application/use-cases/generate-insights.use-case";
import { WeatherLog } from "../../domain/entities/weather-log.entity";

@Controller("weather")
export class WeatherController {
  constructor(
    private readonly createWeatherLogUseCase: CreateWeatherLogUseCase,
    private readonly getWeatherLogsUseCase: GetWeatherLogsUseCase,
    private readonly generateInsightsUseCase: GenerateInsightsUseCase,
  ) {}

  @Post()
  create(@Body() dto: CreateWeatherLogDto): Promise<WeatherLog> {
    return this.createWeatherLogUseCase.execute({
      latitude: dto.latitude,
      longitude: dto.longitude,
      timestamp: new Date(dto.timestamp),
      temperature: dto.temperature,
      humidity: dto.humidity,
      windSpeed: dto.wind_speed,
      cloudCover: dto.cloud_cover,
      shortwaveRadiation: dto.shortwave_radiation,
      directNormalIrradiance: dto.direct_normal_irradiance,
      diffuseRadiation: dto.diffuse_radiation,
      globalTiltedIrradiance: dto.global_tilted_irradiance,
      sunshineDuration: dto.sunshine_duration,
      condition: dto.condition,
    });
  }

  @Get()
  findAll(): Promise<WeatherLog[]> {
    return this.getWeatherLogsUseCase.execute();
  }

  @Get("insights")
  getInsights(): Promise<string[]> {
    return this.generateInsightsUseCase.execute();
  }
}
