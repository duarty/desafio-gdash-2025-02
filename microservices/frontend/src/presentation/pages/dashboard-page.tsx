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
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Download, Thermometer, Droplets, Wind, Cloud, RefreshCw } from "lucide-react";
import { WeatherCard } from "../components/weather-card";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

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

    return (
        <div className="flex flex-col gap-4 sm:gap-6 lg:gap-8 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto min-h-screen">
            {/* Header Section */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
            >
                <div>
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
                        Dashboard Climático
                    </h1>
                    <p className="text-muted-foreground mt-1 sm:mt-2 text-sm sm:text-base lg:text-lg">
                        Monitoramento em tempo real do clima
                    </p>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={loadLogs}
                        disabled={isLoading}
                        className="hover:bg-primary hover:text-primary-foreground transition-all duration-300 shadow-sm"
                    >
                        <RefreshCw className={cn("mr-2 h-4 w-4", isLoading && "animate-spin")} />
                        <span className="hidden xs:inline">Atualizar</span>
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => weatherRepository.exportCsv()}
                        className="hover:bg-primary hover:text-primary-foreground transition-all duration-300 shadow-sm"
                    >
                        <Download className="mr-2 h-4 w-4" />
                        <span className="hidden sm:inline">Exportar</span> CSV
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => weatherRepository.exportXlsx()}
                        className="hover:bg-primary hover:text-primary-foreground transition-all duration-300 shadow-sm"
                    >
                        <Download className="mr-2 h-4 w-4" />
                        <span className="hidden sm:inline">Exportar</span> XLSX
                    </Button>
                </div>
            </motion.div>

            {/* Weather Cards Grid */}
            <div className="grid gap-3 sm:gap-4 lg:gap-6 grid-cols-2 lg:grid-cols-4">
                <WeatherCard
                    title="Temperatura"
                    value={latest ? `${latest.temperature}°C` : "--"}
                    description="Temperatura atual"
                    icon={Thermometer}
                    gradient="bg-gradient-to-br from-orange-500 to-red-600"
                    delay={0.1}
                />
                <WeatherCard
                    title="Umidade"
                    value={latest ? `${latest.humidity}%` : "--"}
                    description="Umidade relativa"
                    icon={Droplets}
                    gradient="bg-gradient-to-br from-blue-400 to-blue-600"
                    delay={0.2}
                />
                <WeatherCard
                    title="Vento"
                    value={latest ? `${latest.windSpeed} km/h` : "--"}
                    description="Velocidade do vento"
                    icon={Wind}
                    gradient="bg-gradient-to-br from-teal-400 to-teal-600"
                    delay={0.3}
                />
                <WeatherCard
                    title="Condição"
                    value={latest ? latest.condition : "--"}
                    description="Condição atual"
                    icon={Cloud}
                    gradient="bg-gradient-to-br from-purple-500 to-indigo-600"
                    delay={0.4}
                />
            </div>

            {/* Charts and Table Section */}
            <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-7">
                {/* Temperature Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.5 }}
                    className="lg:col-span-4"
                >
                    <Card className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white/30 dark:bg-black/30 backdrop-blur-md relative overflow-hidden h-full">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
                        <CardHeader className="pb-2 sm:pb-4">
                            <CardTitle className="text-base sm:text-lg">Histórico de Temperatura</CardTitle>
                        </CardHeader>
                        <CardContent className="pl-0 sm:pl-2">
                            <ResponsiveContainer width="100%" height={280}>
                                <LineChart data={[...logs].reverse()}>
                                    <defs>
                                        <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#ea580c" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#ea580c" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis
                                        dataKey="timestamp"
                                        stroke="#888888"
                                        fontSize={10}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(value) => new Date(value).toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit' })}
                                        interval="preserveStartEnd"
                                    />
                                    <YAxis
                                        stroke="#888888"
                                        fontSize={10}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(value) => `${value}°`}
                                        width={35}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                            backdropFilter: 'blur(4px)',
                                            borderRadius: '8px',
                                            border: '1px solid rgba(0,0,0,0.1)',
                                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                                            fontSize: '12px'
                                        }}
                                        labelFormatter={(value) => new Date(value).toLocaleString("pt-BR")}
                                        formatter={(value: number) => [`${value}°C`, "Temperatura"]}
                                    />
                                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted/20" />
                                    <Line
                                        type="monotone"
                                        dataKey="temperature"
                                        stroke="#ea580c"
                                        strokeWidth={2}
                                        dot={false}
                                        activeDot={{ r: 4, fill: "#ea580c" }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Recent Logs Table */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.6 }}
                    className="lg:col-span-3"
                >
                    <Card className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white/30 dark:bg-black/30 backdrop-blur-md relative overflow-hidden h-full">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
                        <CardHeader className="pb-2 sm:pb-4">
                            <CardTitle className="text-base sm:text-lg">Registros Recentes</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-auto max-h-[280px] -mx-2 px-2">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="hover:bg-transparent border-b-black/5 dark:border-b-white/10">
                                            <TableHead className="text-muted-foreground/80 text-xs sm:text-sm">Hora</TableHead>
                                            <TableHead className="text-muted-foreground/80 text-xs sm:text-sm">Temp</TableHead>
                                            <TableHead className="text-muted-foreground/80 text-xs sm:text-sm hidden sm:table-cell">Condição</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {logs.slice(0, 8).map((log, index) => (
                                            <motion.tr
                                                key={log.id}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.7 + (index * 0.05) }}
                                                className="border-b border-black/5 dark:border-white/5 transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                                            >
                                                <TableCell className="font-medium text-xs sm:text-sm py-2 sm:py-3">
                                                    {new Date(log.timestamp).toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit' })}
                                                </TableCell>
                                                <TableCell className="py-2 sm:py-3">
                                                    <span className={cn(
                                                        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium shadow-sm",
                                                        log.temperature > 25
                                                            ? "bg-red-100/80 text-red-800 dark:bg-red-900/30 dark:text-red-200"
                                                            : "bg-blue-100/80 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200"
                                                    )}>
                                                        {log.temperature}°C
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-xs sm:text-sm py-2 sm:py-3 hidden sm:table-cell">
                                                    {log.condition}
                                                </TableCell>
                                            </motion.tr>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}
