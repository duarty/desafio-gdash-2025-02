import type { WeatherLog } from "../models/weather-log";

export interface InsightsResponse {
    insights: string[];
    source: "gemini" | "local";
    generatedAt: string;
    summary?: string;
}

export interface WeatherRepository {
    getLogs(): Promise<WeatherLog[]>;
    getInsights(): Promise<InsightsResponse>;
    exportCsv(): Promise<void>;
    exportXlsx(): Promise<void>;
}
