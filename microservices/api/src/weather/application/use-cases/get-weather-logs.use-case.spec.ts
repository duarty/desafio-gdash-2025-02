import { GetWeatherLogsUseCase } from "./get-weather-logs.use-case";
import { WeatherRepository } from "../../domain/repositories/weather-repository.interface";
import { WeatherLog } from "../../domain/entities/weather-log.entity";

describe("GetWeatherLogsUseCase", () => {
  let useCase: GetWeatherLogsUseCase;
  let repository: WeatherRepository;

  beforeEach(() => {
    repository = {
      create: jest.fn(),
      findAll: jest.fn(),
    };
    useCase = new GetWeatherLogsUseCase(repository);
  });

  it("should be defined", () => {
    expect(useCase).toBeDefined();
  });

  it("should return weather logs", async () => {
    const expectedResult = [
      new WeatherLog(
        "1",
        10,
        20,
        new Date(),
        25,
        50,
        10,
        0,
        0,
        0,
        0,
        0,
        0,
        "Sunny",
        new Date(),
        new Date(),
      ),
    ];

    (repository.findAll as jest.Mock).mockResolvedValue(expectedResult);

    const result = await useCase.execute();

    expect(result).toEqual(expectedResult);
    expect(repository.findAll).toHaveBeenCalled();
  });
});
