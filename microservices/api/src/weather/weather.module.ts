import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { WeatherController } from "./presentation/controllers/weather.controller";
import { CreateWeatherLogUseCase } from "./application/use-cases/create-weather-log.use-case";
import { GetWeatherLogsUseCase } from "./application/use-cases/get-weather-logs.use-case";
import { GenerateInsightsUseCase } from "./application/use-cases/generate-insights.use-case";
import { MongooseWeatherRepository } from "./infrastructure/persistence/mongoose/repositories/mongoose-weather-repository";
import {
  WeatherLog,
  WeatherLogSchema,
} from "./infrastructure/persistence/mongoose/schemas/weather-log.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: WeatherLog.name, schema: WeatherLogSchema },
    ]),
  ],
  controllers: [WeatherController],
  providers: [
    MongooseWeatherRepository,
    {
      provide: CreateWeatherLogUseCase,
      useFactory: (repo: MongooseWeatherRepository) =>
        new CreateWeatherLogUseCase(repo),
      inject: [MongooseWeatherRepository],
    },
    {
      provide: GetWeatherLogsUseCase,
      useFactory: (repo: MongooseWeatherRepository) =>
        new GetWeatherLogsUseCase(repo),
      inject: [MongooseWeatherRepository],
    },
    {
      provide: GenerateInsightsUseCase,
      useFactory: (repo: MongooseWeatherRepository) =>
        new GenerateInsightsUseCase(repo),
      inject: [MongooseWeatherRepository],
    },
  ],
})
export class WeatherModule {}
