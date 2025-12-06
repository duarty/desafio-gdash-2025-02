import { WeatherRepository } from "../../domain/repositories/weather-repository.interface";

export class ExportCsvUseCase {
    constructor(private readonly weatherRepository: WeatherRepository) { }

    async execute(): Promise<string> {
        const logs = await this.weatherRepository.findAll();

        const headers = [
            "ID",
            "Data/Hora",
            "Latitude",
            "Longitude",
            "Temperatura (°C)",
            "Umidade (%)",
            "Velocidade do Vento (km/h)",
            "Cobertura de Nuvens (%)",
            "Radiação de Ondas Curtas (W/m²)",
            "Irradiância Normal Direta (W/m²)",
            "Radiação Difusa (W/m²)",
            "Irradiância Global Inclinada (W/m²)",
            "Duração do Sol (s)",
            "Condição"
        ];

        const rows = logs.map(log => [
            log.id || "",
            log.timestamp?.toLocaleString("pt-BR") || "",
            log.latitude?.toString() || "",
            log.longitude?.toString() || "",
            log.temperature?.toString() || "",
            log.humidity?.toString() || "",
            log.windSpeed?.toString() || "",
            log.cloudCover?.toString() || "",
            log.shortwaveRadiation?.toString() || "",
            log.directNormalIrradiance?.toString() || "",
            log.diffuseRadiation?.toString() || "",
            log.globalTiltedIrradiance?.toString() || "",
            log.sunshineDuration?.toString() || "",
            log.condition || ""
        ]);

        const csvContent = [
            headers.join(";"),
            ...rows.map(row => row.map(cell => `"${cell}"`).join(";"))
        ].join("\n");

        return csvContent;
    }
}
