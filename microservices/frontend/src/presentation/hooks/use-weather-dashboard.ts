import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { HttpWeatherRepository } from "../../infrastructure/repositories/http-weather-repository";
import type { WeatherLog } from "../../domain/models/weather-log";
import type { InsightsResponse } from "../../domain/usecases/weather-repository";
import { useWeatherStore } from "../../application/store/weather-store";

export function useWeatherDashboard() {
    const [logs, setLogs] = useState<WeatherLog[]>([]);
    const [insightsData, setInsightsData] = useState<InsightsResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // UI States for Filters
    const [chartPeriod, setChartPeriod] = useState("24");
    const [tableLimit, setTableLimit] = useState("10");

    const weatherRepository = useMemo(() => new HttpWeatherRepository(), []);
    const { setCurrentWeather } = useWeatherStore();

    async function loadLogs() {
        setIsLoading(true);
        try {
            const [logsData, insights] = await Promise.all([
                weatherRepository.getLogs(),
                weatherRepository.getInsights()
            ]);
            setLogs(logsData);
            setInsightsData(insights);

            if (logsData.length > 0) {
                const latest = logsData[0];
                setCurrentWeather({
                    temperature: latest.temperature,
                    humidity: latest.humidity,
                    windSpeed: latest.windSpeed,
                    condition: latest.condition
                });
            }
        } catch (error) {
            console.error(error);
            toast.error("Erro ao carregar dados", {
                description: "Não foi possível obter os dados climáticos. Tente novamente mais tarde.",
                action: {
                    label: "Tentar novamente",
                    onClick: () => loadLogs(),
                },
            });
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        loadLogs();
    }, [weatherRepository]);

    return {
        logs,
        insightsData,
        isLoading,
        loadLogs,
        filters: {
            chartPeriod,
            setChartPeriod,
            tableLimit,
            setTableLimit
        }
    };
}
