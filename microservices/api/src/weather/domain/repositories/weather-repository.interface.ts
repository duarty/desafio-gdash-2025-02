import { WeatherLog } from '../entities/weather-log.entity';

export interface WeatherRepository {
    create(weatherLog: Omit<WeatherLog, 'id' | 'createdAt' | 'updatedAt'>): Promise<WeatherLog>;
    findAll(): Promise<WeatherLog[]>;
}
