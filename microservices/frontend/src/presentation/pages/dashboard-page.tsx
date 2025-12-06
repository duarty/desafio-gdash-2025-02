import { useEffect, useState, useMemo } from "react";
import { HttpWeatherRepository } from "../../infrastructure/repositories/http-weather-repository";
import type { WeatherLog } from "../../domain/models/weather-log";
import type { InsightsResponse } from "../../domain/usecases/weather-repository";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Area,
    AreaChart,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Download, Thermometer, Droplets, Wind, Cloud, RefreshCw, Sparkles, ExternalLink, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface FlipStatCardProps {
    title: string;
    value: string | number;
    subtitle: string;
    icon: React.ElementType;
    insight?: string;
    source?: "gemini" | "local";
    isLoading?: boolean;
}

function FlipStatCard({ title, value, subtitle, icon: Icon, insight, source, isLoading }: FlipStatCardProps) {
    const hasInsight = insight && insight.length > 0;
    const isGemini = source === "gemini";

    if (isLoading) {
        return (
            <Card className="h-[140px] border-0 shadow-sm bg-card">
                <CardContent className="flex items-center justify-center h-full">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="group h-[140px] perspective-1000">
            <div className="relative w-full h-full transition-transform duration-500 transform-style-3d group-hover:rotate-y-180">
                <Card className="absolute w-full h-full border-0 shadow-sm bg-card backface-hidden">
                    <CardContent className="p-6 h-full">
                        <div className="flex items-start justify-between h-full">
                            <div className="space-y-2">
                                <p className="text-sm font-medium text-muted-foreground">{title}</p>
                                <p className="text-3xl font-semibold tracking-tight">{value}</p>
                                <p className="text-xs text-muted-foreground">{subtitle}</p>
                            </div>
                            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                <Icon className="h-5 w-5 text-primary" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="absolute w-full h-full border-0 shadow-sm bg-card backface-hidden rotate-y-180">
                    <CardContent className="p-4 h-full flex flex-col justify-between">
                        {hasInsight ? (
                            <>
                                <div className="flex items-start gap-2">
                                    <Sparkles className={cn(
                                        "h-4 w-4 flex-shrink-0 mt-0.5",
                                        isGemini ? "text-blue-500" : "text-amber-500"
                                    )} />
                                    <p className="text-sm leading-relaxed line-clamp-4">{insight}</p>
                                </div>
                                <div className="flex items-center justify-end">
                                    <span className={cn(
                                        "text-[10px] px-1.5 py-0.5 rounded",
                                        isGemini
                                            ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                                            : "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
                                    )}>
                                        {isGemini ? "Gemini AI" : "Local"}
                                    </span>
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-center gap-2">
                                <Sparkles className="h-5 w-5 text-muted-foreground" />
                                <p className="text-xs text-muted-foreground">
                                    Configure a API Gemini para insights
                                </p>
                                <a
                                    href="https://aistudio.google.com/api-keys"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-primary flex items-center gap-1 hover:underline"
                                >
                                    Obter API Key <ExternalLink className="h-3 w-3" />
                                </a>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

const CHART_PERIODS = [
    { value: "12", label: "Últimas 12h" },
    { value: "24", label: "Últimas 24h" },
    { value: "48", label: "Últimas 48h" },
    { value: "all", label: "Todos" },
];

const TABLE_LIMITS = [
    { value: "5", label: "5 registros" },
    { value: "10", label: "10 registros" },
    { value: "20", label: "20 registros" },
    { value: "50", label: "50 registros" },
];

import { useWeatherStore } from "../../application/store/weather-store";

export function DashboardPage() {
    const [logs, setLogs] = useState<WeatherLog[]>([]);
    const [insightsData, setInsightsData] = useState<InsightsResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
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
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        loadLogs();
    }, [weatherRepository]);

    const latest = logs[0];

    const getInsight = (type: "temp" | "humidity" | "wind" | "condition"): string | undefined => {
        if (!insightsData?.insights) return undefined;
        const insights = insightsData.insights;

        switch (type) {
            case "temp":
                return insights.find(i =>
                    i.includes("temperatura") || i.includes("°C") || i.includes("calor") ||
                    i.includes("frio") || i.includes("quente") || i.includes("📈") ||
                    i.includes("📉") || i.includes("🔥") || i.includes("❄️") || i.includes("☀️")
                );
            case "humidity":
                return insights.find(i =>
                    i.includes("umidade") || i.includes("%") || i.includes("💧") ||
                    i.includes("💦") || i.includes("seco") || i.includes("úmido")
                );
            case "wind":
                return insights.find(i =>
                    i.includes("vento") || i.includes("km/h") || i.includes("💨") ||
                    i.includes("🌬️") || i.includes("brisa")
                );
            case "condition":
                return insights.find(i =>
                    i.includes("condição") || i.includes("céu") || i.includes("☁️") ||
                    i.includes("🌤️") || i.includes("🌧️") || i.includes("sol") ||
                    i.includes("chuva") || i.includes("nublado")
                ) || insights[insights.length - 1];
        }
    };

    const chartData = useMemo(() => {
        const reversed = [...logs].reverse();
        if (chartPeriod === "all") return reversed;
        return reversed.slice(-parseInt(chartPeriod));
    }, [logs, chartPeriod]);

    const tableData = useMemo(() => {
        return logs.slice(0, parseInt(tableLimit));
    }, [logs, tableLimit]);

    return (
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
                    <p className="text-muted-foreground mt-1">
                        Monitoramento climático em tempo real
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={loadLogs}
                        disabled={isLoading}
                    >
                        <RefreshCw className={cn("h-4 w-4 mr-2", isLoading && "animate-spin")} />
                        Atualizar
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => weatherRepository.exportCsv()}
                    >
                        <Download className="h-4 w-4 mr-2" />
                        CSV
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => weatherRepository.exportXlsx()}
                    >
                        <Download className="h-4 w-4 mr-2" />
                        Excel
                    </Button>
                </div>
            </div>

            {/* Stats Grid with Flip Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                <FlipStatCard
                    title="Temperatura"
                    value={latest ? `${latest.temperature}°C` : "—"}
                    subtitle="Temperatura atual"
                    icon={Thermometer}
                    insight={getInsight("temp")}
                    source={insightsData?.source}
                    isLoading={isLoading}
                />
                <FlipStatCard
                    title="Umidade"
                    value={latest ? `${latest.humidity}%` : "—"}
                    subtitle="Umidade relativa"
                    icon={Droplets}
                    insight={getInsight("humidity")}
                    source={insightsData?.source}
                    isLoading={isLoading}
                />
                <FlipStatCard
                    title="Vento"
                    value={latest ? `${latest.windSpeed} km/h` : "—"}
                    subtitle="Velocidade do vento"
                    icon={Wind}
                    insight={getInsight("wind")}
                    source={insightsData?.source}
                    isLoading={isLoading}
                />
                <FlipStatCard
                    title="Condição"
                    value={latest?.condition || "—"}
                    subtitle="Condição atual"
                    icon={Cloud}
                    insight={getInsight("condition")}
                    source={insightsData?.source}
                    isLoading={isLoading}
                />
            </div>

            {/* Charts Section */}
            <div className="grid gap-6 lg:grid-cols-5 mb-8">
                {/* Temperature Chart */}
                <Card className="lg:col-span-3 border-0 shadow-sm">
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-base font-medium">Temperatura</CardTitle>
                            <Select value={chartPeriod} onValueChange={setChartPeriod}>
                                <SelectTrigger className="w-[140px] h-8 text-xs">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {CHART_PERIODS.map((p) => (
                                        <SelectItem key={p.value} value={p.value}>
                                            {p.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.15} />
                                            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis
                                        dataKey="timestamp"
                                        stroke="hsl(var(--muted-foreground))"
                                        fontSize={11}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(value) => new Date(value).toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit' })}
                                        interval="preserveStartEnd"
                                        tick={{ fill: 'hsl(var(--muted-foreground))' }}
                                    />
                                    <YAxis
                                        stroke="hsl(var(--muted-foreground))"
                                        fontSize={11}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(value) => `${value}°`}
                                        width={40}
                                        tick={{ fill: 'hsl(var(--muted-foreground))' }}
                                    />
                                    <Tooltip
                                        content={({ active, payload }) => {
                                            if (active && payload && payload.length) {
                                                return (
                                                    <div className="bg-white dark:bg-zinc-900 border rounded-lg shadow-lg p-3">
                                                        <p className="text-sm font-medium">{payload[0].value}°C</p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {new Date(payload[0].payload.timestamp).toLocaleString("pt-BR")}
                                                        </p>
                                                    </div>
                                                );
                                            }
                                            return null;
                                        }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="temperature"
                                        stroke="hsl(var(--primary))"
                                        strokeWidth={2}
                                        fill="url(#tempGradient)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Humidity Chart */}
                <Card className="lg:col-span-2 border-0 shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base font-medium">Umidade</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={chartData}>
                                    <XAxis
                                        dataKey="timestamp"
                                        stroke="hsl(var(--muted-foreground))"
                                        fontSize={11}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(value) => new Date(value).toLocaleTimeString("pt-BR", { hour: '2-digit' })}
                                        interval="preserveStartEnd"
                                        tick={{ fill: 'hsl(var(--muted-foreground))' }}
                                    />
                                    <YAxis
                                        stroke="hsl(var(--muted-foreground))"
                                        fontSize={11}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(value) => `${value}%`}
                                        width={40}
                                        domain={[0, 100]}
                                        tick={{ fill: 'hsl(var(--muted-foreground))' }}
                                    />
                                    <Tooltip
                                        content={({ active, payload }) => {
                                            if (active && payload && payload.length) {
                                                return (
                                                    <div className="bg-white dark:bg-zinc-900 border rounded-lg shadow-lg p-3">
                                                        <p className="text-sm font-medium">{payload[0].value}%</p>
                                                        <p className="text-xs text-muted-foreground">Umidade</p>
                                                    </div>
                                                );
                                            }
                                            return null;
                                        }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="humidity"
                                        stroke="hsl(173 58% 45%)"
                                        strokeWidth={2}
                                        dot={false}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Records Table */}
            <Card className="border-0 shadow-sm">
                <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-base font-medium">Registros Recentes</CardTitle>
                        <Select value={tableLimit} onValueChange={setTableLimit}>
                            <SelectTrigger className="w-[130px] h-8 text-xs">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {TABLE_LIMITS.map((l) => (
                                    <SelectItem key={l.value} value={l.value}>
                                        {l.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent">
                                    <TableHead className="text-xs">Data/Hora</TableHead>
                                    <TableHead className="text-xs">Temperatura</TableHead>
                                    <TableHead className="text-xs hidden sm:table-cell">Umidade</TableHead>
                                    <TableHead className="text-xs hidden md:table-cell">Vento</TableHead>
                                    <TableHead className="text-xs hidden lg:table-cell">Condição</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {tableData.map((log) => (
                                    <TableRow key={log.id} className="hover:bg-muted/50">
                                        <TableCell className="text-sm">
                                            {new Date(log.timestamp).toLocaleString("pt-BR", {
                                                day: '2-digit',
                                                month: '2-digit',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </TableCell>
                                        <TableCell>
                                            <span className={cn(
                                                "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium",
                                                log.temperature > 30
                                                    ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                                    : log.temperature > 25
                                                        ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                                                        : log.temperature < 15
                                                            ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                                                            : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                            )}>
                                                {log.temperature}°C
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-sm hidden sm:table-cell">{log.humidity}%</TableCell>
                                        <TableCell className="text-sm hidden md:table-cell">{log.windSpeed} km/h</TableCell>
                                        <TableCell className="text-sm hidden lg:table-cell text-muted-foreground">{log.condition}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
