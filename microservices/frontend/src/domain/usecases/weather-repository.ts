import type { WeatherLog } from "../models/weather-log";

export interface WeatherRepository {
    getLogs(): Promise<WeatherLog[]>;
    getInsights(): Promise<string[]>;
    exportCsv(): Promise<void>;
    exportXlsx(): Promise<void>;
}
