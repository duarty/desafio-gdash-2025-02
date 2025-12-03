import { WeatherLog } from '../../domain/entities/weather-log.entity';
import { WeatherRepository } from '../../domain/repositories/weather-repository.interface';

export class GenerateInsightsUseCase {
    constructor(private readonly weatherRepository: WeatherRepository) { }

    async execute(): Promise<string[]> {
        const logs = await this.weatherRepository.findAll();
        if (logs.length === 0) {
            return ['No data available to generate insights.'];
        }

        // Simple example logic for insights
        const insights: string[] = [];
        const latest = logs[0];

        if (latest.temperature > 30) {
            insights.push('It is very hot today.');
        } else if (latest.temperature < 10) {
            insights.push('It is cold today.');
        } else {
            insights.push('The temperature is pleasant.');
        }

        if (latest.humidity > 80) {
            insights.push('High humidity detected.');
        }

        return insights;
    }
}
