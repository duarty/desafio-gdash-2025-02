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
import { Download, Thermometer, Droplets, Wind, Cloud } from "lucide-react";
import { WeatherCard } from "../components/weather-card";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function DashboardPage() {
    const [logs, setLogs] = useState<WeatherLog[]>([]);
    const weatherRepository = useMemo(() => new HttpWeatherRepository(), []);

    useEffect(() => {
        async function loadLogs() {
            const data = await weatherRepository.getLogs();
            setLogs(data);
        }
        loadLogs();
    }, [weatherRepository]);

    const latest = logs[0];

    return (
        <div className="flex flex-col gap-8 p-8 max-w-7xl mx-auto min-h-screen bg-gray-50/50 dark:bg-gray-900/50">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex items-center justify-between"
            >
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
                        Weather Dashboard
                    </h1>
                    <p className="text-muted-foreground mt-2 text-lg">
                        Real-time weather monitoring and analysis.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" size="sm" onClick={() => weatherRepository.exportCsv()} className="hover:bg-primary hover:text-primary-foreground transition-all duration-300 shadow-sm">
                        <Download className="mr-2 h-4 w-4" />
                        Export CSV
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => weatherRepository.exportXlsx()} className="hover:bg-primary hover:text-primary-foreground transition-all duration-300 shadow-sm">
                        <Download className="mr-2 h-4 w-4" />
                        Export XLSX
                    </Button>
                </div>
            </motion.div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <WeatherCard
                    title="Temperature"
                    value={latest ? `${latest.temperature}°C` : "--"}
                    description="Current temperature"
                    icon={Thermometer}
                    gradient="bg-gradient-to-br from-orange-500 to-red-600"
                    delay={0.1}
                />
                <WeatherCard
                    title="Humidity"
                    value={latest ? `${latest.humidity}%` : "--"}
                    description="Relative humidity"
                    icon={Droplets}
                    gradient="bg-gradient-to-br from-blue-400 to-blue-600"
                    delay={0.2}
                />
                <WeatherCard
                    title="Wind Speed"
                    value={latest ? `${latest.windSpeed} km/h` : "--"}
                    description="Current wind speed"
                    icon={Wind}
                    gradient="bg-gradient-to-br from-teal-400 to-teal-600"
                    delay={0.3}
                />
                <WeatherCard
                    title="Condition"
                    value={latest ? latest.condition : "--"}
                    description="Current weather condition"
                    icon={Cloud}
                    gradient="bg-gradient-to-br from-purple-500 to-indigo-600"
                    delay={0.4}
                />
            </div>

            <div className="grid gap-6 md:grid-cols-7">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.5 }}
                    className="col-span-4"
                >
                    <Card className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white/30 dark:bg-black/30 backdrop-blur-md relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
                        <CardHeader>
                            <CardTitle>Temperature Overview</CardTitle>
                        </CardHeader>
                        <CardContent className="pl-2">
                            <ResponsiveContainer width="100%" height={350}>
                                <LineChart data={[...logs].reverse()}>
                                    <defs>
                                        <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis
                                        dataKey="timestamp"
                                        stroke="#888888"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(value) => new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    />
                                    <YAxis
                                        stroke="#888888"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(value) => `${value}°C`}
                                    />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(4px)', borderRadius: 'var(--radius)', border: '1px solid rgba(255,255,255,0.2)', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                        itemStyle={{ color: 'var(--foreground)' }}
                                    />
                                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted/20" />
                                    <Line
                                        type="monotone"
                                        dataKey="temperature"
                                        stroke="#ea580c"
                                        strokeWidth={1}
                                        dot={false}
                                        activeDot={{ r: 4, fill: "#ea580c" }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.6 }}
                    className="col-span-3"
                >
                    <Card className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white/30 dark:bg-black/30 backdrop-blur-md relative overflow-hidden h-full">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
                        <CardHeader>
                            <CardTitle>Recent Logs</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-auto max-h-[350px] pr-2">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="hover:bg-transparent border-b-black/5 dark:border-b-white/10">
                                            <TableHead className="text-muted-foreground/80">Time</TableHead>
                                            <TableHead className="text-muted-foreground/80">Temp</TableHead>
                                            <TableHead className="text-muted-foreground/80">Cond</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {logs.slice(0, 10).map((log, index) => (
                                            <motion.tr
                                                key={log.id}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.7 + (index * 0.05) }}
                                                className="border-b border-black/5 dark:border-white/5 transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                                            >
                                                <TableCell className="font-medium">{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</TableCell>
                                                <TableCell>
                                                    <span className={cn(
                                                        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium shadow-sm",
                                                        log.temperature > 25
                                                            ? "bg-red-100/80 text-red-800 dark:bg-red-900/30 dark:text-red-200"
                                                            : "bg-blue-100/80 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200"
                                                    )}>
                                                        {log.temperature}°C
                                                    </span>
                                                </TableCell>
                                                <TableCell>{log.condition}</TableCell>
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
