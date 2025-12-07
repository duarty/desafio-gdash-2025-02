import { Thermometer, Droplets, Wind, Cloud, Loader2 } from "lucide-react";
import { FlipStatCard } from "./flip-stat-card";
import type { WeatherLog } from "../../../domain/models/weather-log";
import type { InsightsResponse } from "../../../domain/usecases/weather-repository";
import { InsightPresenter } from "../../presenters/insight-presenter";

interface FlipStatGridProps {
    logs: WeatherLog[];
    insightsData: InsightsResponse | null;
    isLoading: boolean;
}

export function FlipStatGrid({ logs, insightsData, isLoading }: FlipStatGridProps) {
    if (isLoading && logs.length === 0) {
        return (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[1, 2, 3, 4].map((i) => (
                    <FlipStatCard
                        key={i}
                        title="Carregando..."
                        value="--"
                        subtitle="..."
                        icon={Loader2}
                        isLoading={true}
                    />
                ))}
            </div>
        );
    }

    if (logs.length === 0) {
        return null;
    }

    const latest = logs[0];
    const source = insightsData?.source || "local";

    const getInsight = (type: "temp" | "humidity" | "wind" | "condition"): string | undefined => {
        return InsightPresenter.getInsightForType(insightsData?.insights, type);
    };

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <FlipStatCard
                title="Temperatura"
                value={`${latest.temperature}°C`}
                subtitle="Temperatura atual"
                icon={Thermometer}
                insight={getInsight("temp")}
                source={source}
            />
            <FlipStatCard
                title="Umidade"
                value={`${latest.humidity}%`}
                subtitle="Umidade relativa"
                icon={Droplets}
                insight={getInsight("humidity")}
                source={source}
            />
            <FlipStatCard
                title="Vento"
                value={`${latest.windSpeed} km/h`}
                subtitle="Velocidade do vento"
                icon={Wind}
                insight={getInsight("wind")}
                source={source}
            />
            <FlipStatCard
                title="Condição"
                value={latest.condition}
                subtitle="Clima atual"
                icon={Cloud}
                insight={getInsight("condition")}
                source={source}
            />
        </div>
    );
}
