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
import { Download } from "lucide-react";

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

    return (
        <div className="flex flex-col gap-8 p-8 max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Weather Dashboard</h1>
                    <p className="text-muted-foreground mt-2">
                        Real-time weather monitoring and analysis.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => weatherRepository.exportCsv()} className="hover:bg-primary hover:text-primary-foreground transition-colors">
                        <Download className="mr-2 h-4 w-4" />
                        Export CSV
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => weatherRepository.exportXlsx()} className="hover:bg-primary hover:text-primary-foreground transition-colors">
                        <Download className="mr-2 h-4 w-4" />
                        Export XLSX
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card className="hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Temperature</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">
                            {logs.length > 0 ? `${logs[0].temperature}°C` : "--"}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Current temperature
                        </p>
                    </CardContent>
                </Card>
                <Card className="hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Humidity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">
                            {logs.length > 0 ? `${logs[0].humidity}%` : "--"}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Relative humidity
                        </p>
                    </CardContent>
                </Card>
                <Card className="hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Wind Speed</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">
                            {logs.length > 0 ? `${logs[0].windSpeed} km/h` : "--"}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Current wind speed
                        </p>
                    </CardContent>
                </Card>
                <Card className="hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Condition</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">
                            {logs.length > 0 ? logs[0].condition : "--"}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Current weather condition
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-7">
                <Card className="col-span-4 hover:shadow-xl transition-all duration-300">
                    <CardHeader>
                        <CardTitle>Temperature Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <ResponsiveContainer width="100%" height={350}>
                            <LineChart data={logs}>
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
                                    contentStyle={{ backgroundColor: 'var(--card)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}
                                    itemStyle={{ color: 'var(--foreground)' }}
                                />
                                <CartesianGrid strokeDasharray="3 3" className="stroke-muted/50" />
                                <Line
                                    type="monotone"
                                    dataKey="temperature"
                                    stroke="var(--primary)"
                                    strokeWidth={2}
                                    dot={false}
                                    activeDot={{ r: 6, fill: "var(--primary)" }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className="col-span-3 hover:shadow-xl transition-all duration-300">
                    <CardHeader>
                        <CardTitle>Recent Logs</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-auto max-h-[350px]">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Time</TableHead>
                                        <TableHead>Temp</TableHead>
                                        <TableHead>Cond</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {logs.slice(0, 10).map((log) => (
                                        <TableRow key={log.id}>
                                            <TableCell className="font-medium">{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</TableCell>
                                            <TableCell>{log.temperature}°C</TableCell>
                                            <TableCell>{log.condition}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
