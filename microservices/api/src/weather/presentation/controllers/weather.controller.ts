import { Controller, Get, Post, Body, Res, Header } from "@nestjs/common";
import { FastifyReply } from "fastify";
import { CreateWeatherLogDto } from "../dtos/create-weather-log.dto";
import { CreateWeatherLogUseCase } from "../../application/use-cases/create-weather-log.use-case";
import { GetWeatherLogsUseCase } from "../../application/use-cases/get-weather-logs.use-case";
import { GenerateInsightsUseCase } from "../../application/use-cases/generate-insights.use-case";
import { ExportCsvUseCase } from "../../application/use-cases/export-csv.use-case";
import { ExportXlsxUseCase } from "../../application/use-cases/export-xlsx.use-case";
import { WeatherLog } from "../../domain/entities/weather-log.entity";

@Controller("weather")
export class WeatherController {
  constructor(
    private readonly createWeatherLogUseCase: CreateWeatherLogUseCase,
    private readonly getWeatherLogsUseCase: GetWeatherLogsUseCase,
    private readonly generateInsightsUseCase: GenerateInsightsUseCase,
    private readonly exportCsvUseCase: ExportCsvUseCase,
    private readonly exportXlsxUseCase: ExportXlsxUseCase,
  ) { }

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

  @Get("export/csv")
  @Header("Content-Type", "text/csv")
  @Header("Content-Disposition", 'attachment; filename="weather_logs.csv"')
  async exportCsv(@Res() reply: FastifyReply): Promise<void> {
    const csvContent = await this.exportCsvUseCase.execute();
    reply.header("Content-Type", "text/csv");
    reply.header("Content-Disposition", 'attachment; filename="weather_logs.csv"');
    reply.send(csvContent);
  }

  @Get("export/xlsx")
  @Header("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
  @Header("Content-Disposition", 'attachment; filename="weather_logs.xlsx"')
  async exportXlsx(@Res() reply: FastifyReply): Promise<void> {
    const xlsxBuffer = await this.exportXlsxUseCase.execute();
    reply.header("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    reply.header("Content-Disposition", 'attachment; filename="weather_logs.xlsx"');
    reply.send(xlsxBuffer);
  }
}
