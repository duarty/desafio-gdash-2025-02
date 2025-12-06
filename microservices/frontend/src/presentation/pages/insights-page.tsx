import { useEffect, useState, useMemo } from "react";
import { HttpWeatherRepository } from "../../infrastructure/repositories/http-weather-repository";
import type { InsightsResponse } from "../../domain/usecases/weather-repository";
import { Card, CardContent } from "@/components/ui/card";
import { Lightbulb, Loader2, Sparkles, Bot, Cpu } from "lucide-react";

export function InsightsPage() {
    const [data, setData] = useState<InsightsResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const weatherRepository = useMemo(() => new HttpWeatherRepository(), []);

    useEffect(() => {
        async function loadInsights() {
            setIsLoading(true);
            try {
                const response = await weatherRepository.getInsights();
                setData(response);
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

            {/* Source Badge */}
            {data && (
                <div className="mb-6">
                    {data.source === "gemini" ? (
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20">
                            <Bot className="h-4 w-4 text-blue-500" />
                            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                                Gerado por Google Gemini AI
                            </span>
                        </div>
                    ) : (
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-100/50 dark:bg-amber-900/20 border border-amber-500/20">
                            <Cpu className="h-4 w-4 text-amber-500" />
                            <span className="text-sm font-medium text-amber-600 dark:text-amber-400">
                                Insights gerados localmente
                            </span>
                        </div>
                    )}
                </div>
            )}

            {/* Content */}
            {isLoading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
            ) : !data || data.insights.length === 0 ? (
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
                    {data.insights.map((insight, index) => (
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
            {data && data.insights.length > 0 && (
                <div className="mt-8 p-4 rounded-lg bg-muted/50 border border-border/50">
                    <div className="flex items-start gap-3">
                        {data.source === "gemini" ? (
                            <>
                                <Bot className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium">Insights com Google Gemini</p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Estes insights foram gerados usando inteligência artificial do Google Gemini,
                                        analisando os dados climáticos coletados.
                                    </p>
                                </div>
                            </>
                        ) : (
                            <>
                                <Lightbulb className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium">Insights Locais</p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Estes insights foram gerados localmente com base em regras e análises estatísticas dos dados climáticos.
                                        Configure uma API key do Gemini para insights mais ricos com IA.
                                    </p>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
