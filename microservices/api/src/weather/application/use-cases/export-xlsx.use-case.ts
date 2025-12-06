import { WeatherRepository } from "../../domain/repositories/weather-repository.interface";
import * as ExcelJS from "exceljs";

export class ExportXlsxUseCase {
    constructor(private readonly weatherRepository: WeatherRepository) { }

    async execute(): Promise<Buffer> {
        const logs = await this.weatherRepository.findAll();

        const workbook = new ExcelJS.Workbook();
        workbook.creator = "GDASH Weather API";
        workbook.created = new Date();

        const worksheet = workbook.addWorksheet("Registros Climáticos");

        worksheet.columns = [
            { header: "ID", key: "id", width: 25 },
            { header: "Data/Hora", key: "timestamp", width: 22 },
            { header: "Latitude", key: "latitude", width: 12 },
            { header: "Longitude", key: "longitude", width: 12 },
            { header: "Temperatura (°C)", key: "temperature", width: 18 },
            { header: "Umidade (%)", key: "humidity", width: 14 },
            { header: "Velocidade do Vento (km/h)", key: "windSpeed", width: 26 },
            { header: "Cobertura de Nuvens (%)", key: "cloudCover", width: 24 },
            { header: "Radiação de Ondas Curtas (W/m²)", key: "shortwaveRadiation", width: 30 },
            { header: "Irradiância Normal Direta (W/m²)", key: "directNormalIrradiance", width: 32 },
            { header: "Radiação Difusa (W/m²)", key: "diffuseRadiation", width: 24 },
            { header: "Irradiância Global Inclinada (W/m²)", key: "globalTiltedIrradiance", width: 34 },
            { header: "Duração do Sol (s)", key: "sunshineDuration", width: 20 },
            { header: "Condição", key: "condition", width: 15 },
        ];

        // Style header row
        worksheet.getRow(1).font = { bold: true };
        worksheet.getRow(1).fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FF4F81BD" },
        };
        worksheet.getRow(1).font = { bold: true, color: { argb: "FFFFFFFF" } };

        // Add data rows
        logs.forEach(log => {
            worksheet.addRow({
                id: log.id || "",
                timestamp: log.timestamp?.toLocaleString("pt-BR") || "",
                latitude: log.latitude || 0,
                longitude: log.longitude || 0,
                temperature: log.temperature || 0,
                humidity: log.humidity || 0,
                windSpeed: log.windSpeed || 0,
                cloudCover: log.cloudCover || 0,
                shortwaveRadiation: log.shortwaveRadiation || 0,
                directNormalIrradiance: log.directNormalIrradiance || 0,
                diffuseRadiation: log.diffuseRadiation || 0,
                globalTiltedIrradiance: log.globalTiltedIrradiance || 0,
                sunshineDuration: log.sunshineDuration || 0,
                condition: log.condition || "",
            });
        });

        const buffer = await workbook.xlsx.writeBuffer();
        return Buffer.from(buffer);
    }
}
