import { WeatherLog } from '../../domain/entities/weather-log.entity';
import { WeatherRepository } from '../../domain/repositories/weather-repository.interface';

export class GetWeatherLogsUseCase {
    constructor(private readonly weatherRepository: WeatherRepository) { }

    async execute(): Promise<WeatherLog[]> {
        return this.weatherRepository.findAll();
    }
}
