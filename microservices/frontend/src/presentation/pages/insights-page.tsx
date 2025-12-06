import { useEffect, useState, useMemo } from "react";
import { HttpWeatherRepository } from "../../infrastructure/repositories/http-weather-repository";
import { Card, CardContent } from "@/components/ui/card";
import { Lightbulb, Loader2, Sparkles } from "lucide-react";

export function InsightsPage() {
    const [insights, setInsights] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const weatherRepository = useMemo(() => new HttpWeatherRepository(), []);

    useEffect(() => {
        async function loadInsights() {
            setIsLoading(true);
            try {
                const data = await weatherRepository.getInsights();
                setInsights(data);
            } finally {
                setIsLoading(false);
            }
        }
        loadInsights();
    }, [weatherRepository]);

    return (
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="h-10 w-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                        <Sparkles className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                    </div>
                    <h1 className="text-2xl font-semibold tracking-tight">Insights</h1>
                </div>
                <p className="text-muted-foreground">
                    Análises inteligentes baseadas nos dados climáticos
                </p>
            </div>

            {/* Content */}
            {isLoading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
            ) : insights.length === 0 ? (
                <Card className="border-0 shadow-sm">
                    <CardContent className="flex flex-col items-center justify-center py-16">
                        <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
                            <Lightbulb className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <h3 className="font-medium mb-1">Nenhum insight disponível</h3>
                        <p className="text-sm text-muted-foreground text-center max-w-sm">
                            Ainda não há dados suficientes para gerar insights. Continue coletando dados climáticos.
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {insights.map((insight, index) => (
                        <Card key={index} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                            <CardContent className="p-6">
                                <div className="flex items-start gap-4">
                                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                        <span className="text-xs font-semibold text-primary">
                                            {index + 1}
                                        </span>
                                    </div>
                                    <p className="text-sm leading-relaxed">{insight}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Info */}
            {insights.length > 0 && (
                <div className="mt-8 p-4 rounded-lg bg-muted/50 border border-border/50">
                    <div className="flex items-start gap-3">
                        <Lightbulb className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm font-medium">Sobre os Insights</p>
                            <p className="text-xs text-muted-foreground mt-1">
                                Estes insights são gerados automaticamente com base nos dados climáticos coletados pelo sistema.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
