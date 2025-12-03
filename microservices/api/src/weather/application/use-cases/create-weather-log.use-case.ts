import { WeatherLog } from '../../domain/entities/weather-log.entity';
import { WeatherRepository } from '../../domain/repositories/weather-repository.interface';

export class CreateWeatherLogUseCase {
    constructor(private readonly weatherRepository: WeatherRepository) { }

    async execute(data: Omit<WeatherLog, 'id' | 'createdAt' | 'updatedAt'>): Promise<WeatherLog> {
        return this.weatherRepository.create(data);
    }
}
