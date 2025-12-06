import { useEffect, useState, useMemo } from "react";
import { HttpWeatherRepository } from "../../infrastructure/repositories/http-weather-repository";
import type { WeatherLog } from "../../domain/models/weather-log";
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
import { Download, Thermometer, Droplets, Wind, Cloud, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
    title: string;
    value: string | number;
    subtitle: string;
    icon: React.ElementType;
    trend?: "up" | "down" | "neutral";
}

function StatCard({ title, value, subtitle, icon: Icon }: StatCardProps) {
    return (
        <Card className="border-0 shadow-sm bg-card">
            <CardContent className="p-6">
                <div className="flex items-start justify-between">
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
    );
}

export function DashboardPage() {
    const [logs, setLogs] = useState<WeatherLog[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const weatherRepository = useMemo(() => new HttpWeatherRepository(), []);

    async function loadLogs() {
        setIsLoading(true);
        try {
            const data = await weatherRepository.getLogs();
            setLogs(data);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        loadLogs();
    }, [weatherRepository]);

    const latest = logs[0];
    const chartData = [...logs].reverse().slice(-24);

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

            {/* Stats Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                <StatCard
                    title="Temperatura"
                    value={latest ? `${latest.temperature}°C` : "—"}
                    subtitle="Temperatura atual"
                    icon={Thermometer}
                />
                <StatCard
                    title="Umidade"
                    value={latest ? `${latest.humidity}%` : "—"}
                    subtitle="Umidade relativa"
                    icon={Droplets}
                />
                <StatCard
                    title="Vento"
                    value={latest ? `${latest.windSpeed} km/h` : "—"}
                    subtitle="Velocidade do vento"
                    icon={Wind}
                />
                <StatCard
                    title="Condição"
                    value={latest?.condition || "—"}
                    subtitle="Condição atual"
                    icon={Cloud}
                />
            </div>

            {/* Charts Section */}
            <div className="grid gap-6 lg:grid-cols-5 mb-8">
                {/* Temperature Chart */}
                <Card className="lg:col-span-3 border-0 shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base font-medium">Temperatura</CardTitle>
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
                                                    <div className="bg-popover border rounded-lg shadow-lg p-3">
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
                                                    <div className="bg-popover border rounded-lg shadow-lg p-3">
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
                    <CardTitle className="text-base font-medium">Registros Recentes</CardTitle>
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
                                {logs.slice(0, 10).map((log) => (
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
