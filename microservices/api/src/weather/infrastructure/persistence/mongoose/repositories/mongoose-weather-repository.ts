import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { WeatherRepository } from "../../../../domain/repositories/weather-repository.interface";
import { WeatherLog } from "../../../../domain/entities/weather-log.entity";
import {
  WeatherLogDocument,
  WeatherLog as WeatherLogSchema,
} from "../schemas/weather-log.schema";

@Injectable()
export class MongooseWeatherRepository implements WeatherRepository {
  constructor(
    @InjectModel(WeatherLogSchema.name)
    private readonly weatherLogModel: Model<WeatherLogDocument>,
  ) { }

  async create(
    data: Omit<WeatherLog, "id" | "createdAt" | "updatedAt">,
  ): Promise<WeatherLog> {
    const createdLog = new this.weatherLogModel({
      latitude: data.latitude,
      longitude: data.longitude,
      timestamp: data.timestamp,
      temperature: data.temperature,
      humidity: data.humidity,
      wind_speed: data.windSpeed,
      cloud_cover: data.cloudCover,
      shortwave_radiation: data.shortwaveRadiation,
      direct_normal_irradiance: data.directNormalIrradiance,
      diffuse_radiation: data.diffuseRadiation,
      global_tilted_irradiance: data.globalTiltedIrradiance,
      sunshine_duration: data.sunshineDuration,
      condition: data.condition,
    });
    const savedLog = await createdLog.save();
    return this.mapToEntity(savedLog);
  }

  async findAll(): Promise<WeatherLog[]> {
    const logs = await this.weatherLogModel
      .find()
      .sort({ timestamp: -1 })
      .limit(100)
      .exec();
    return logs.map((log) => this.mapToEntity(log));
  }

  private mapToEntity(document: WeatherLogDocument): WeatherLog {
    return new WeatherLog(
      document._id.toString(),
      document.latitude,
      document.longitude,
      document.timestamp,
      document.temperature,
      document.humidity,
      document.wind_speed,
      document.cloud_cover,
      document.shortwave_radiation,
      document.direct_normal_irradiance,
      document.diffuse_radiation,
      document.global_tilted_irradiance,
      document.sunshine_duration,
      document.condition,
      (document as any).createdAt,
      (document as any).updatedAt,
    );
  }
}
