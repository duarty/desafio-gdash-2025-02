import { Test, TestingModule } from '@nestjs/testing';
import { CreateWeatherLogUseCase } from './create-weather-log.use-case';
import { WeatherRepository } from '../../domain/repositories/weather-repository.interface';
import { WeatherLog } from '../../domain/entities/weather-log.entity';

describe('CreateWeatherLogUseCase', () => {
    let useCase: CreateWeatherLogUseCase;
    let repository: WeatherRepository;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CreateWeatherLogUseCase,
                {
                    provide: 'WeatherRepository', // We might need to use a token or abstract class if using DI with interface directly, but here we inject manually or mock
                    useValue: {
                        create: jest.fn(),
                    },
                },
            ],
        }).compile();

        // Manually instantiating for simplicity with interface mocking
        repository = {
            create: jest.fn(),
            findAll: jest.fn(),
        };
        useCase = new CreateWeatherLogUseCase(repository);
    });

    it('should be defined', () => {
        expect(useCase).toBeDefined();
    });

    it('should create a weather log', async () => {
        const input = {
            latitude: 10,
            longitude: 20,
            timestamp: new Date(),
            temperature: 25,
            humidity: 50,
            windSpeed: 10,
            cloudCover: 0,
            shortwaveRadiation: 0,
            directNormalIrradiance: 0,
            diffuseRadiation: 0,
            globalTiltedIrradiance: 0,
            sunshineDuration: 0,
            condition: 'Sunny',
        };

        const expectedResult = new WeatherLog(
            '1',
            input.latitude,
            input.longitude,
            input.timestamp,
            input.temperature,
            input.humidity,
            input.windSpeed,
            input.cloudCover,
            input.shortwaveRadiation,
            input.directNormalIrradiance,
            input.diffuseRadiation,
            input.globalTiltedIrradiance,
            input.sunshineDuration,
            input.condition,
            new Date(),
            new Date(),
        );

        (repository.create as jest.Mock).mockResolvedValue(expectedResult);

        const result = await useCase.execute(input);

        expect(result).toEqual(expectedResult);
        expect(repository.create).toHaveBeenCalledWith(input);
    });
});
