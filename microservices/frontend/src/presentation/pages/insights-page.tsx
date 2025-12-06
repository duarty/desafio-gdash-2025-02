import { useEffect, useState, useMemo } from "react";
import { HttpWeatherRepository } from "../../infrastructure/repositories/http-weather-repository";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";

export function InsightsPage() {
    const [insights, setInsights] = useState<string[]>([]);
    const weatherRepository = useMemo(() => new HttpWeatherRepository(), []);

    useEffect(() => {
        async function loadInsights() {
            const data = await weatherRepository.getInsights();
            setInsights(data);
        }
        loadInsights();
    }, [weatherRepository]);

    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-bold tracking-tight">AI Insights</h1>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {insights.map((insight, index) => (
                    <Card key={index}>
                        <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Insight #{index + 1}</CardTitle>
                            <Lightbulb className="h-4 w-4 text-yellow-500" />
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">{insight}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
