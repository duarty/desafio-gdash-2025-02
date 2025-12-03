import { GenerateInsightsUseCase } from './generate-insights.use-case';
import { WeatherRepository } from '../../domain/repositories/weather-repository.interface';
import { WeatherLog } from '../../domain/entities/weather-log.entity';

describe('GenerateInsightsUseCase', () => {
    let useCase: GenerateInsightsUseCase;
    let repository: WeatherRepository;

    beforeEach(() => {
        repository = {
            create: jest.fn(),
            findAll: jest.fn(),
        };
        useCase = new GenerateInsightsUseCase(repository);
    });

    it('should be defined', () => {
        expect(useCase).toBeDefined();
    });

    it('should return "No data available" if no logs found', async () => {
        (repository.findAll as jest.Mock).mockResolvedValue([]);

        const result = await useCase.execute();

        expect(result).toEqual(['No data available to generate insights.']);
    });

    it('should generate insights for hot weather', async () => {
        const logs = [
            new WeatherLog(
                '1', 10, 20, new Date(), 35, 50, 10, 0, 0, 0, 0, 0, 0, 'Sunny', new Date(), new Date()
            )
        ];
        (repository.findAll as jest.Mock).mockResolvedValue(logs);

        const result = await useCase.execute();

        expect(result).toContain('It is very hot today.');
    });
});
