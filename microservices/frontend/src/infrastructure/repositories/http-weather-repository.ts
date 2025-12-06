import type { WeatherLog } from "../../domain/models/weather-log";
import type { WeatherRepository } from "../../domain/usecases/weather-repository";
import { api } from "../api/client";

export class HttpWeatherRepository implements WeatherRepository {
    async getLogs(): Promise<WeatherLog[]> {
        const response = await api.get<WeatherLog[]>("/weather");
        return response.data;
    }

    async getInsights(): Promise<string[]> {
        const response = await api.get<string[]>("/weather/insights");
        return response.data;
    }

    async exportCsv(): Promise<void> {
        const response = await api.get("/weather/export/csv", { responseType: "blob" });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "weather_logs.csv");
        document.body.appendChild(link);
        link.click();
    }

    async exportXlsx(): Promise<void> {
        const response = await api.get("/weather/export/xlsx", { responseType: "blob" });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "weather_logs.xlsx");
        document.body.appendChild(link);
        link.click();
    }
}
