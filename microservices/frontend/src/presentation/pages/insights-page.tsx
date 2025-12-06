import { useEffect, useState, useMemo } from "react";
import { HttpWeatherRepository } from "../../infrastructure/repositories/http-weather-repository";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, Loader2, Sparkles, TrendingUp, AlertTriangle, ThermometerSun } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const insightIcons = [Sparkles, TrendingUp, ThermometerSun, AlertTriangle, Lightbulb];
const insightColors = [
    "from-blue-500 to-cyan-500",
    "from-green-500 to-emerald-500",
    "from-orange-500 to-amber-500",
    "from-red-500 to-rose-500",
    "from-purple-500 to-violet-500",
];

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
        <div className="flex flex-col gap-4 sm:gap-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="flex items-center gap-3 mb-2">
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 shadow-lg shadow-orange-500/25">
                        <Sparkles className="h-5 w-5 text-white" />
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
                        Insights com IA
                    </h1>
                </div>
                <p className="text-muted-foreground text-sm sm:text-base">
                    Análises inteligentes baseadas nos dados climáticos coletados
                </p>
            </motion.div>

            {/* Content */}
            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
                    <p className="text-muted-foreground">Gerando insights...</p>
                </div>
            ) : insights.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-20"
                >
                    <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                        <Lightbulb className="h-10 w-10 text-muted-foreground/50" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Nenhum insight disponível</h3>
                    <p className="text-muted-foreground text-center max-w-md">
                        Ainda não há dados suficientes para gerar insights. Continue coletando dados climáticos.
                    </p>
                </motion.div>
            ) : (
                <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    {insights.map((insight, index) => {
                        const Icon = insightIcons[index % insightIcons.length];
                        const colorClass = insightColors[index % insightColors.length];

                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: index * 0.1 }}
                            >
                                <Card className="group relative overflow-hidden border-0 shadow-lg bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full">
                                    {/* Gradient accent */}
                                    <div className={cn(
                                        "absolute top-0 left-0 w-full h-1 bg-gradient-to-r",
                                        colorClass
                                    )} />

                                    <CardHeader className="flex flex-row items-start gap-3 pb-3">
                                        <div className={cn(
                                            "flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br text-white shadow-lg flex-shrink-0",
                                            colorClass
                                        )}>
                                            <Icon className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-sm font-semibold text-muted-foreground">
                                                Insight #{index + 1}
                                            </CardTitle>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="pt-0">
                                        <p className="text-sm sm:text-base leading-relaxed">
                                            {insight}
                                        </p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        );
                    })}
                </div>
            )}

            {/* Info Section */}
            {insights.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="mt-4"
                >
                    <Card className="border-0 bg-muted/30">
                        <CardContent className="flex items-start gap-3 p-4">
                            <Lightbulb className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm font-medium">Sobre os Insights</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Estes insights são gerados automaticamente com base nos dados climáticos coletados
                                    pelo sistema. Eles são atualizados conforme novos dados são recebidos.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            )}
        </div>
    );
}
