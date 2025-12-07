import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import type { WeatherLog } from "../../../domain/models/weather-log";

interface WeatherHistoryTableProps {
    logs: WeatherLog[];
    limit: string;
    onLimitChange: (value: string) => void;
    tableLimits: { value: string; label: string }[];
}

export function WeatherHistoryTable({ logs, limit, onLimitChange, tableLimits }: WeatherHistoryTableProps) {
    const VITE_API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

    const handleExport = (type: 'csv' | 'xlsx') => {
        window.open(`${VITE_API_URL}/weather/export/${type}`, '_blank');
    };

    const displayLogs = logs.slice(0, parseInt(limit));

    return (
        <Card className="border-0 shadow-sm bg-card">
            <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-4">
                    <CardTitle className="text-sm font-medium">Histórico de Registros</CardTitle>
                    <Select value={limit} onValueChange={onLimitChange}>
                        <SelectTrigger className="w-[130px] h-8 text-xs bg-muted/50 border-0">
                            <SelectValue placeholder="Registros" />
                        </SelectTrigger>
                        <SelectContent>
                            {tableLimits.map((l) => (
                                <SelectItem key={l.value} value={l.value} className="text-xs">
                                    {l.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="h-8 text-xs gap-2" onClick={() => handleExport('csv')}>
                        <Download className="h-3.5 w-3.5" />
                        CSV
                    </Button>
                    <Button variant="outline" size="sm" className="h-8 text-xs gap-2" onClick={() => handleExport('xlsx')}>
                        <Download className="h-3.5 w-3.5" />
                        Excel
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-muted/50 border-b border-border/50">
                            <TableHead className="text-xs">Data/Hora</TableHead>
                            <TableHead className="text-xs">Local</TableHead>
                            <TableHead className="text-xs">Condição</TableHead>
                            <TableHead className="text-xs">Temp.</TableHead>
                            <TableHead className="text-xs">Umid.</TableHead>
                            <TableHead className="text-xs">Vento</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {displayLogs.map((log) => (
                            <TableRow key={log.id} className="hover:bg-muted/50 border-b border-border/50">
                                <TableCell className="font-medium text-xs">
                                    {new Date(log.createdAt).toLocaleString("pt-BR", {
                                        day: "2-digit",
                                        month: "2-digit",
                                        year: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit"
                                    })}
                                </TableCell>
                                <TableCell className="text-xs">
                                    {log.latitude.toFixed(2)}, {log.longitude.toFixed(2)}
                                </TableCell>
                                <TableCell className="text-xs">{log.condition}</TableCell>
                                <TableCell className="text-xs">{log.temperature}°C</TableCell>
                                <TableCell className="text-xs">{log.humidity}%</TableCell>
                                <TableCell className="text-xs">{log.windSpeed} km/h</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
